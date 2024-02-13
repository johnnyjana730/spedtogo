# -*- coding: utf-8 -*-
import asyncio
import json
from typing import Any, Callable, Dict, Optional
from urllib.parse import urlencode

import httpx
from playwright.async_api import BrowserContext, Page

import config
from tools import utils

from .exception import DataFetchError, IPBlockError
from .graphql import KuaiShouGraphQL


class KuaiShouClient:
    def __init__(
            self,
            timeout=10,
            proxies=None,
            *,
            headers: Dict[str, str],
            playwright_page: Page,
            cookie_dict: Dict[str, str],
    ):
        self.proxies = proxies
        self.timeout = timeout
        self.headers = headers
        self._host = "https://www.kuaishou.com/graphql"
        self.playwright_page = playwright_page
        self.cookie_dict = cookie_dict
        self.graphql = KuaiShouGraphQL()

    async def request(self, method, url, **kwargs) -> Any:
        async with httpx.AsyncClient(proxies=self.proxies) as client:
            response = await client.request(
                method, url, timeout=self.timeout,
                **kwargs
            )
        data: Dict = response.json()
        if data.get("errors"):
            raise DataFetchError(data.get("errors", "unkonw error"))
        else:
            return data.get("data", {})

    async def get(self, uri: str, params=None) -> Dict:
        final_uri = uri
        if isinstance(params, dict):
            final_uri = (f"{uri}?"
                         f"{urlencode(params)}")
        return await self.request(method="GET", url=f"{self._host}{final_uri}", headers=self.headers)

    async def post(self, uri: str, data: dict) -> Dict:
        json_str = json.dumps(data, separators=(',', ':'), ensure_ascii=False)
        return await self.request(method="POST", url=f"{self._host}{uri}",
                                  data=json_str, headers=self.headers)

    @staticmethod
    async def pong() -> bool:
        """get a note to check if login state is ok"""
        utils.logger.info("Begin pong kuaishou...")
        ping_flag = False
        try:
            pass
        except Exception as e:
            utils.logger.error(f"Pong kuaishou failed: {e}, and try to login again...")
            ping_flag = False
        return ping_flag

    async def update_cookies(self, browser_context: BrowserContext):
        cookie_str, cookie_dict = utils.convert_cookies(await browser_context.cookies())
        self.headers["Cookie"] = cookie_str
        self.cookie_dict = cookie_dict

    async def search_info_by_keyword(self, keyword: str, pcursor: str):
        """
        KuaiShou web search api
        :param keyword: search keyword
        :param pcursor: limite page curson
        :return:
        """
        post_data = {
            "operationName": "visionSearchPhoto",
            "variables": {
                "keyword": keyword,
                "pcursor": pcursor,
                "page": "search"
            },
            "query": self.graphql.get("search_query")
        }
        return await self.post("", post_data)

    async def get_video_info(self, photo_id: str) -> Dict:
        """
        Kuaishou web video detail api
        :param photo_id:
        :return:
        """
        post_data = {
            "operationName": "visionVideoDetail",
            "variables": {
                "photoId": photo_id,
                "page": "search"
            },
            "query": self.graphql.get("video_detail")
        }
        return await self.post("", post_data)

    async def get_video_comments(self, photo_id: str, pcursor: str = "") -> Dict:
        """get video comments
        :param photo_id: photo id you want to fetch
        :param pcursor: last you get pcursor, defaults to ""
        :return:
        """
        post_data = {
            "operationName": "commentListQuery",
            "variables": {
                "photoId": photo_id,
                "pcursor": pcursor
            },
            "query": self.graphql.get("comment_list")

        }
        return await self.post("", post_data)

    async def get_video_all_comments(self, photo_id: str, crawl_interval: float = 1.0, is_fetch_sub_comments=False,
                                     callback: Optional[Callable] = None):
        """
        get video all comments include sub comments
        :param photo_id:
        :param crawl_interval:
        :param is_fetch_sub_comments:
        :param callback:
        :return:
        """

        result = []
        pcursor = ""
        count = 0  # 计数器，记录已获取的评论数量

        while pcursor != "no_more" and (
                config.MAX_COMMENTS_PER_POST == 0 or count < config.MAX_COMMENTS_PER_POST):
            comments_res = await self.get_video_comments(photo_id, pcursor)
            vision_commen_list = comments_res.get("visionCommentList", {})
            pcursor = vision_commen_list.get("pcursor", "")
            comments = vision_commen_list.get("rootComments", [])

            filtered_comments = []  # 存储经过关键词筛选后的评论

            for comment in comments:
                content = comment.get("content", "")

                if not config.COMMENT_KEYWORDS or any(keyword in content for keyword in config.COMMENT_KEYWORDS):
                    filtered_comments.append(comment)

                    count += 1
                    if config.MAX_COMMENTS_PER_POST != 0 and count >= config.MAX_COMMENTS_PER_POST:
                        break

            if callback:  # 如果有回调函数，就执行回调函数
                await callback(photo_id, filtered_comments)

            result.extend(filtered_comments)
            await asyncio.sleep(crawl_interval)
            if not is_fetch_sub_comments:
                continue
            # todo handle get sub comments
        return result
