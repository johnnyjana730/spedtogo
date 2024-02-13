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
# import sys
# # Add a new directory to sys.path
# sys.path.insert(0, 'C://Users//Chang-YuTai//speed2go//data_process//google_map//google_maps_scraper//')

# from src.scrape_google_maps import ScrapeGoogleMaps
# from src.scrape_google_maps_links_task import ScrapeGoogleMapsLinksTask
# from botasaurus_v2.botasaurus.launch_tasks import launch_tasks
from bose import LocalStorage
from pymongo import MongoClient
import threading
import time
from google_search import GoogleInfo

google_info = GoogleInfo()

def generate_query(cur_loc, place_names):
    queries = []
    same_place_name = defaultdict(list)
    for place_name, note_list in place_names.items():
        same_place_name[place_name] += note_list

    for place_name, note_list in same_place_name.items():
        if check_place_name_valid(place_name) is False: 
            continue
        search_p_names = [place_name.replace('\n', ''), cur_loc + ' ' + place_name.replace('\n', '')]
        search_p_names = [p_name for p_name in search_p_names if len(p_name.replace(' ', '')) >= 3]

        for p_name in search_p_names:
            queries.append({"keyword": p_name, 'extracted_place_name': place_name, 'xhs_note_list': note_list, 'job_type': 'google_map'})

    return queries


def run_google_map_scraper(city_name, queries, ngrok_url):


    outputs, todo_queries = get_saved_result(queries, city_name)

    google_info.search_google_map(todo_queries, city_name)

    outputs, _ = get_saved_result(queries, city_name)

    place_name_result = {}
    for output in outputs:
        if 'title' not in output:
            continue
        place_name = output['extracted_place_name']
        if place_name not in place_name_result:
            place_name_result[place_name] = []
        place_name_result[place_name].append(output)

    return place_name_result


def generate_output_dict(result, types, place_valid, word_match_valid, note_id_info, google_info_dic):
    notes_to_keywords = {}
    xhs_notes = list(set(result['xhs_note_list']))
    for note_id in xhs_notes:
        notes_to_keywords[note_id] = [result['extracted_place_name'], word_match_valid, note_id_info[note_id]['title'], None]

    # merge old data
    if result['title'] in google_info_dic:
        pre_notes = google_info_dic[result['title']]['note']
        xhs_notes= list(set(xhs_notes + pre_notes))

        pre_notes_to_keywords = google_info_dic[result['title']]['notes_to_keywords']
        pre_place_valid = google_info_dic[result['title']]['valid']
        place_valid = place_valid or pre_place_valid

        for note_id in pre_notes_to_keywords:
            pre_keyword_set = pre_notes_to_keywords[note_id]
            if note_id not in notes_to_keywords:
                notes_to_keywords[note_id] = pre_keyword_set

    n_data = {
        "place_name": result['title'],
        'geometry': {
            "location": {
                "lat": result['cordinates'][0],
                "lng": result['cordinates'][1]
            }
        },
        "rating": result['rating'],
        'reviews': result['reviews'],
        "note": xhs_notes,
        "types": types,
        "valid": place_valid,
        'notes_to_keywords': notes_to_keywords
    }

    return n_data


def query_google_info(place_file_name, city_name, place_type, place_type_not, city_coords, ngrok_url, MAX_DISTANCE = 200, fuzz_threshold=50):
    google_info_dic = {}

    place_names = load_place_data(place_file_name, city_name)
    queries = generate_query(city_name, place_names)
    place_name_result = run_google_map_scraper(city_name, queries, ngrok_url)
    note_id_info = check_xhs_info(city_name)
    ranked_place = {}

    for place_name, search_results in place_name_result.items(): 
        all_results = []
        for result in search_results:


            word_match_valid = True
            name = result['title']
            similarity_ratio = fuzz.partial_ratio(name.lower(), place_name.lower())

            if count_chinese_letters(place_name) > 0:

                place_name_tr = traditional_to_simplified(place_name)
                name_tr = traditional_to_simplified(name)
                similarity_ratio = max(similarity_ratio, fuzz.partial_ratio(name_tr.lower(), place_name_tr.lower()))

            if similarity_ratio < fuzz_threshold or (len(name) - len(place_name) > 7 and len(place_name) < 7 and count_chinese_letters(place_name) < 2):
                word_match_valid = False

            ori_place_name = place_name.replace(city_name, "").replace(' ', '')
            if len(ori_place_name) < 5 and count_chinese_letters(ori_place_name) <= 0:
                word_match_valid = False

            # if count_chinese_letters(ori_place_name) >= 3: return True
            # if place_name.replace(city_name, "")

            # Calculate the distance between the place and Los Angeles
            place_coords = result['cordinates']
            distance = great_circle(city_coords, place_coords).miles

            place_valid=True

            like_count = 0
            for note_id in result['xhs_note_list']:
                like_count += note_id_info[note_id]['liked']

            reviews_count = result['reviews']
            # if reviews_count is not None and reviews_count < 30:
            #     place_valid=False

            if reviews_count is not None and reviews_count < 50:
                if like_count < 30:
                    place_valid=False

            if distance <= MAX_DISTANCE:  # Set your desired maximum distance
                all_results.append([-similarity_ratio, result, place_valid, word_match_valid])


        if len(all_results) > 0:
            all_results = sorted(all_results, key=lambda x: (x[0]))
            _, result, place_valid, word_match_valid = all_results[0]

            # print(f"search: {place_name} found: {result['title']} type: {result['main_category']}")

            types = categories_transfer(result['categories'])

            flag = True
            for p_type in place_type:
                if types != None and p_type in types:
                    flag = True
            for p_type in place_type_not:
                if types != None and p_type in types:
                    flag = False
                    place_valid = False

            # print(f"search: {place_name} found: {result['title']} types: {result['categories']}"
            #      + f", rate: {result.get('rating', 'N/A')}")

            n_data = generate_output_dict(result, types, place_valid, word_match_valid, note_id_info, google_info_dic)

            google_info_dic[n_data['place_name']] = n_data

    match_result = google_info.entity_link_google_search(city_name, google_info_dic)

    process_keyword_info(google_info_dic, match_result, note_id_info)
    filter_places(google_info_dic)
    rank_places(google_info_dic)

    return google_info_dic

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument("--note_name", help="Prompt to generate images for", type=str)
    parser.add_argument("--city_name", help="Prompt to generate images for", type=str)
    parser.add_argument("--place_file_names", help="Prompt to generate images for", type=str)
    parser.add_argument("--place_file_name", help="Prompt to generate images for", type=str)
    parser.add_argument("--place_type", help="Prompt to generate images for", type=str, default="")
    parser.add_argument("--place_type_not", help="Prompt to generate images for", type=str)
    parser.add_argument("--ngrok_url", help="Prompt to generate images for", type=str)
    parser.add_argument("--fuzz_threshold", help="Prompt to generate images for", type=int, default=50)
    parser.add_argument("--MAX_DISTANCE", help="Prompt to generate images for", type=int)
    parser.add_argument("--version_tag", help="Prompt to generate images for", type=str, default="20240105")

    # Use nargs to specify the number of arguments for city_coords
    parser.add_argument("--city_coords", help="Coordinates of the city (latitude and longitude)", nargs=2, type=float)

    args = parser.parse_args()


    place_file_names = args.place_file_names.strip().split(',')
    for place_file_name in place_file_names:
        city_name = args.city_name.strip()
        place_file_name = city_name + ' ' + place_file_name
        place_type, place_type_not = get_type_filter(place_file_name)
        MAX_DISTANCE = args.MAX_DISTANCE
        ngrok_url = args.ngrok_url
        city_coords = getcity_corrd(city_name)
        version_tag = args.version_tag

        print('place_file_name, city_name, place_type, place_type_not, city_coords, ngrok_url = ', 
                place_file_name, city_name, place_type, place_type_not, city_coords, ngrok_url)

        # check data version
        if check_data_version(place_file_name, city_name, version_tag) or check_gpt_result(city_name, place_file_name):
            continue

        google_info_dic = query_google_info(place_file_name, city_name, place_type, place_type_not, city_coords, ngrok_url, MAX_DISTANCE = MAX_DISTANCE, fuzz_threshold=args.fuzz_threshold)

        # save_data(place_file_name, city_name, google_info_dic)
        save_data(place_file_name, city_name, google_info_dic, version_tag)