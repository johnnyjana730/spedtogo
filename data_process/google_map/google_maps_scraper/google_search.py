import pickle
import pandas as pd
from utils import *
import argparse
from fuzzywuzzy import fuzz
from geopy.distance import great_circle
import requests
from collections import defaultdict
from pypinyin import pinyin, lazy_pinyin, Style
import pydash
from pymongo import MongoClient
import threading
import time


def find_all_keywords_not_match(city_name, google_info_dic):
    query_keyword_set = {}
    for place_name in google_info_dic:
        place_data = google_info_dic[place_name]
        notes_to_keywords = place_data['notes_to_keywords']

        for note_id, keyword_set in notes_to_keywords.items():
            keyword, word_match_valid, _, _ = keyword_set
            if word_match_valid is False:
                query_keyword_set[keyword] = {"found_place_name": place_name}


    done_queries = []
    todo_queries = []
    for keyword in query_keyword_set:
        found_place_name = query_keyword_set[keyword]["found_place_name"]
        output_file_path = './search_output/' + city_name + '/' + pydash.kebab_case(keyword) + '.json'

        if os.path.exists(output_file_path) == False:
            query_dict = {}
            # all key required
            query_dict['keyword'] = keyword
            query_dict['found_place_name'] = found_place_name
            query_dict['xhs_note_list'] = ['123']
            query_dict['job_type'] = 'google_search'
            todo_queries.append(query_dict)
        else:
            with open(output_file_path, 'r') as file:
                current_output = json.load(file)
            done_queries.append([keyword, current_output])

    return done_queries, todo_queries

def find_keywords_no_result(city_name, query_dict):
    done_queries = []
    todo_queries = []

    for query in query_dict:
        output_file_path = './search_gp_output/' + city_name + '/' + pydash.kebab_case(query) + '.json'

        if os.path.exists(output_file_path) == False:
            query_dict = {}
            # all key required
            query_dict['keyword'] = query
            query_dict['found_place_name'] = query
            query_dict['xhs_note_list'] = ['123']
            query_dict['job_type'] = 'google_search'
            todo_queries.append(query_dict)
        else:
            with open(output_file_path, 'r') as file:
                current_output = json.load(file)
            done_queries.append([query, current_output])

    return done_queries, todo_queries


class GoogleInfo:
    def __init__(self):
        self.search_idx = 0
        self.resource_lock = threading.Lock()

    def google_map_by_url(self, thread_id, city_name, todo_queries):
        api_keys = get_apikeys()
        api_key = api_keys[thread_id]
        print('api_key = ', api_key)
        if api_key == None: 
            return
            
        alive = False
        response = check_api_alive(api_key)
        if response['status'] == "Server is alive":
            alive = True

        if alive is False:
            return
            
        # cur_queries = []
        # with self.resource_lock:
        #     cur_queries = todo_queries[5 * self.search_idx: 5 * self.search_idx + 5]
        #     queries_json = json.dumps(cur_queries)
        #     self.search_idx += 1

        cur_queries = []
        check_idx = None
        with self.resource_lock:
            check_idx = self.search_idx
            self.search_idx += 1

        cur_queries = todo_queries[5 * check_idx: 5 * check_idx + 5]

        queries_json = json.dumps(cur_queries)

        if len(cur_queries) == 0:
            return 

        response = requests.get(f"{api_key}/api", params={'queries': queries_json, 'city': city_name}, timeout=1000)

        if response.status_code == 200:
            data_list = response.json()
            # assert len(cur_queries) == len(data_list)
            if len(cur_queries) != len(data_list):
                return
            for n_i in range(len(data_list)):
                keyword = cur_queries[n_i]["keyword"]
                output_file_path = './output/' + city_name + '/' + pydash.kebab_case(keyword) + '.json'
                if not os.path.exists('./output/' + city_name + '/' ):
                    os.makedirs('./output/' + city_name + '/' )
                cur_data = data_list[n_i]
                if len(cur_data) == 0:
                    cur_data = {}
                with open(output_file_path, 'w') as file:
                    json.dump([cur_data], file)


    def google_search_by_url(self, thread_id, city_name, todo_queries):

        api_keys = get_apikeys()
        api_key = api_keys[thread_id]
        print('api_key = ', api_key)
        if api_key == None:
            return

        alive = False
        response = check_api_alive(api_key)
        if response['status'] == "Server is alive":
            alive = True

        if alive is False:
            return

        cur_queries = []
        check_idx = None
        with self.resource_lock:
            check_idx = self.search_idx
            self.search_idx += 1

        cur_queries = todo_queries[5 * check_idx: 5 * check_idx + 5]
        queries_json = json.dumps(cur_queries)

        if len(cur_queries) == 0:
            return

        response = requests.get(f"{api_key}/google_search", params={'queries': queries_json, 'city': city_name}, timeout=1000)

        if response.status_code == 200:
            data_list = response.json()
            # print('cur_queries = ', cur_queries)
            # print('data_list = ', data_list)
            if len(cur_queries) != len(data_list):
                return
            # assert len(cur_queries) == len(data_list)
            for n_i in range(len(data_list)):
                keyword = cur_queries[n_i]["keyword"]
                output_file_path = './search_output/' + city_name + '/' + pydash.kebab_case(keyword) + '.json'
                if not os.path.exists('./search_output/' + city_name + '/' ):
                    os.makedirs('./search_output/' + city_name + '/' )
                cur_data = data_list[n_i]
                if len(cur_data) == 0:
                    cur_data = {}
                with open(output_file_path, 'w', encoding='utf-8') as file:
                    json.dump([cur_data], file, ensure_ascii=False)



    def search_google_map(self, todo_queries, city_name):

        self.search_idx = 0
        api_keys = get_apikeys()

        while 5 * self.search_idx < len(todo_queries):
            threads = []
            for i in range(len(api_keys)):
                thread = threading.Thread(target=self.google_map_by_url, args=(i, city_name, todo_queries))
                threads.append(thread)
                thread.start()
            
            for thread in threads:
                thread.join()
                # if thread.is_alive():
                #     thread._stop() 


    def entity_link_google_search(self, city_name, google_info_dic):

        done_queries, todo_queries = find_all_keywords_not_match(city_name, google_info_dic)
        api_keys = get_apikeys()

        self.search_idx = 0

        while 5 * self.search_idx < len(todo_queries):
            threads = []
            for i in range(len(api_keys)):
                thread = threading.Thread(target=self.google_search_by_url, args=(i, city_name, todo_queries))
                threads.append(thread)
                thread.start()
            
            for thread in threads:
                thread.join()

        done_queries, todo_queries = find_all_keywords_not_match(city_name, google_info_dic)

        match_result = {}
        for keyword, query in done_queries:

            search_keyword = query[0]['keyword']
            found_place_name = query[0]['found_place_name']
            search_result = query[0]['google_search_data']
            if isinstance(search_result, str) == False:
                search_result = ""

            match_result[keyword] = False
            # for search_p1 in search_result.split('\n'):
            #     # print('search_result.lower()) = ', search_p1.lower()[:500])
            #     # print('found_place_name.lower() = ', found_place_name.lower().strip())
            #     # print('search_keyword = ', search_keyword)
            #     # print('fuzz = ', fuzz.partial_ratio(found_place_name.lower(), search_p1.lower()))
            #     # input()
            #     if len(found_place_name) < len(search_p1) and len(search_keyword) > 3:
            #         if fuzz.partial_ratio(found_place_name.lower(), search_p1.lower()) > 90:
            #             match_result[keyword] = 'google_search_matched'
            #             # input()

            if found_place_name.lower() in search_result.lower():
                if (len(search_keyword) > 2 or count_chinese_letters(search_keyword) >= 2):
                    match_result[keyword] = 'google_search_matched'

                    # print('keyword = ', keyword, ' found_place_name.lower()  = ',  found_place_name.lower() )

        return match_result


    # def entity_google_search(self, city_name, query_dict):

    # def entity_google_search(self, city_name, queries):

    #     done_queries, todo_queries = find_keywords_no_result(city_name, queries)

    #     api_keys = get_apikeys()

    #     self.search_idx = 0

    #     while 5 * self.search_idx < len(todo_queries):
    #         threads = []
    #         for i in range(len(api_keys)):
    #             thread = threading.Thread(target=self.google_search_by_url, args=(i, city_name, todo_queries))
    #             threads.append(thread)
    #             thread.start()
            
    #         for thread in threads:
    #             thread.join(300)
    #             if thread.is_alive():
    #                 thread._stop() 

    #     done_queries, todo_queries = find_keywords_no_result(city_name, queries)

    #     return done_queries, todo_queries


