import argparse
import asyncio
import sys

import config
import db
from base.base_crawler import AbstractCrawler
from media_platform.bilibili import BilibiliCrawler
from media_platform.douyin import DouYinCrawler
from media_platform.kuaishou import KuaishouCrawler
from media_platform.xhs import XiaoHongShuCrawler
from proxy import proxy_account_pool

import os
import csv
from config.utils import generate_keywords

def filter_out_success_note(city, subarea, keywords):

    n_keywords = []
    for keyword in keywords:

        if len(subarea) > 0:
            keyword = city + " " + subarea + ' ' + keyword.strip()
            csv_file_path = f"../../../data/xhs_crawl_raw/{city}/{subarea}/comment/{keyword}.csv"
        else:
            keyword = city + ' ' + keyword.strip()
            csv_file_path = f"../../../data/xhs_crawl_raw/{city}/comment/{keyword}.csv"


        flag = False
        if os.path.exists(csv_file_path):
            row_count = 0
            with open(csv_file_path, 'r') as file:
                # Create a CSV reader object
                csv_reader = csv.reader(file)
                
                # Use the len function to count the number of rows
                row_count = len(list(csv_reader))
            if row_count >= 15:
                flag = True

        if flag == False:
            n_keywords.append(keyword)

    return n_keywords



class CrawlerFactory:
    CRAWLERS = {
        "xhs": XiaoHongShuCrawler,
        "dy": DouYinCrawler,
        "ks": KuaishouCrawler,
        "bili": BilibiliCrawler
    }

    @staticmethod
    def create_crawler(platform: str, config = config) -> AbstractCrawler:
        crawler_class = CrawlerFactory.CRAWLERS.get(platform)
        if not crawler_class:
            raise ValueError("Invalid Media Platform Currently only supported xhs or dy or ks or bili ...")
        return crawler_class(config)


async def main():
    # define command line params ...
    parser = argparse.ArgumentParser(description='Media crawler program.')
    parser.add_argument('--platform', type=str, help='Media platform select (xhs | dy | ks | bili)',
                        choices=["xhs", "dy", "ks", "bili"], default=config.PLATFORM)
    parser.add_argument('--lt', type=str, help='Login type (qrcode | phone | cookie)',
                        choices=["qrcode", "phone", "cookie"], default=config.LOGIN_TYPE)
    parser.add_argument('--type', type=str, help='crawler type (search | detail)',
                        choices=["search", "detail"], default=config.CRAWLER_TYPE)

    parser.add_argument('--cookies', type=str, default='')
    parser.add_argument('--keywords', type=str, default='')
    parser.add_argument('--city', type=str, default='LA')
    parser.add_argument('--subarea', type=str, default='')

    # init db
    if config.IS_SAVED_DATABASED:
        await db.init_db()

    args = parser.parse_args()
    

    CITY = args.city
    SUBAREA = args.subarea
    KEYWORDS = args.keywords.split(',')
    KEYWORDS = filter_out_success_note(CITY, SUBAREA, KEYWORDS)


    config.CITY = CITY
    config.SUBAREA = SUBAREA
    config.KEYWORDS = KEYWORDS

    args.lt = "cookie"  
    config.LOGIN_TYPE = args.lt # qrcode or phone or cookie

    print('current CITY = ', CITY)
    print('filtered KEYWORDS = ', KEYWORDS)

    if len(KEYWORDS) == 0:
        return 
    # input()



    crawler = CrawlerFactory.create_crawler(platform=args.platform, config=config)
    crawler.init_config(
        platform=args.platform,
        login_type=args.lt,
        crawler_type=args.type
    )
    await crawler.start()


if __name__ == '__main__':
    try:
        # asyncio.run(main())
        asyncio.get_event_loop().run_until_complete(main())
    except KeyboardInterrupt:
        sys.exit()
