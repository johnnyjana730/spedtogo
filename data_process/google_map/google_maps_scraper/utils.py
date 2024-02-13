import json
import csv
import re
import pandas as pd
import os
import pickle
import pathlib
import pydash
import nltk
import time
import glob
# nltk.download('punkt')  # Download the Punkt tokenizer models



def check_sub_area(city):
    place_names = {}
    file_path = pathlib.Path(f"../../../data/LLM_extract/{city}/")

    # Use glob to get a list of folders
    folders = glob.glob(str(file_path / "*"))

    # Extract folder names
    sub_area_names = [pathlib.Path(folder).name for folder in folders]

    return sub_area_names


def load_place_data(file_name, city):


    place_names = {}
    file_path = pathlib.Path(f"../../../data/LLM_extract/{city}/{file_name}.json")

    print('file_path = ', file_path)
    if file_path.exists():
        with open(file_path, 'r', encoding="utf8") as file:
            place_names = json.load(file)

    sub_area_names = check_sub_area(city)

    for sub_area in sub_area_names:
        n_file_name = file_name[len(city) + 1:]

        file_path = pathlib.Path(f"../../../data/LLM_extract/{city}/{sub_area}/{n_file_name}.json")
        if file_path.exists():
            print('sub area = ', file_path)
            with open(file_path, 'r', encoding="utf8") as file:
                sub_place_names = json.load(file)

            for sub_place in sub_place_names:
                if sub_place not in place_names:
                    place_names[sub_place] = sub_place_names[sub_place]
                else:
                    place_names[sub_place] = place_names[sub_place] + sub_place_names[sub_place]
                    place_names[sub_place] = list(set(place_names[sub_place]))
    return place_names

def check_gpt_result(city_name, file_name):

    file_path = pathlib.Path(f"../../../data/LLM_extract/{city_name}/{file_name}.json")
    if file_path.exists() == False:
        return True
    return False

def check_data_version(file_name, city_name, version_tag):
    # Use json.load to load the dictionary from the file
    file_path = f'../../../data/Google_map/{city_name}/{file_name}.json'
    if os.path.exists(file_path):
        with open(file_path, "r", encoding='utf-8') as json_file:
            data_dic = json.load(json_file)

        if 'version_tag' in data_dic and data_dic['version_tag'] == version_tag:
            return True

    return False


def save_data(file_name, city_name, data_dic, version_tag):
    # Use pickle.dump to save the dictionary to the file
    data_dic['version_tag'] = version_tag
    pathlib.Path(f'../../../data/Google_map/{city_name}/' ).mkdir(parents=True, exist_ok=True)
    with open(f'../../../data/Google_map/{city_name}/{file_name}.json', "w", encoding='utf-8') as json_file:
        json.dump(data_dic, json_file, ensure_ascii=False, indent=2)

def count_chinese_letters(input_string):
    chinese_count = 0
    for char in input_string:
        # Check if the character is a Chinese character
        if '\u4e00' <= char <= '\u9fff':
            chinese_count += 1
    return chinese_count

def count_english_words(input_text):
    words = nltk.word_tokenize(input_text)
    english_words = [word for word in words if word.isalpha()]  # Filter out non-alphabetic words
    return len(english_words)

def get_saved_result(queries, city):
    outputs = []
    n_queries = []
    for query in queries:

        output_file_path = './output/' + city + '/' + pydash.kebab_case(query['keyword']) + '.json'
        if os.path.exists(output_file_path):
            with open(output_file_path, 'r') as file:
                current_output = json.load(file)

            if len(current_output) > 0 and len(current_output[0]) > 1 and 'title' in current_output[0]:
                current_output[0]['extracted_place_name'] = query['extracted_place_name']
                current_output[0]['xhs_note_list'] = query['xhs_note_list']
                outputs.append(current_output[0])
        else:
            n_queries.append(query)

    return outputs, n_queries

# def read_all_results(queries, city):
#     exist_query = {}
    
#     folder_path = './output/' + city + '/'

#     json_files = glob.glob(os.path.join(folder_path, '*.json'))

#     # Iterate through the JSON files and read them
#     for json_file in json_files:
#         with open(json_file, 'r') as file:
#             data = json.load(file)

#         if len(data) > 0 and len(data[0]) > 1 and 'title' in data[0]:
#             exist_query[data[0]['keyword']] = data[0]
            
#             # current_output[0]['extracted_place_name'] = query['extracted_place_name']
#             # current_output[0]['xhs_note_list'] = query['xhs_note_list']
#             # replaced

#     return exist_query

def check_place_name_valid(place_name):
    flag = True
    if count_chinese_letters(place_name) > 40:
        flag = False
        
    if count_chinese_letters(place_name) <= 2:
        if len(place_name.replace(' ', '')) <= 4 or len(place_name.replace(' ', '')) > 70:
            flag = False

        if len(place_name.replace(' ', '')) <= 5 and ':' in place_name:
            flag = False


    # print('place_name = ', place_name, 'flag = ', flag)
    # input()

    # if count_chinese_letters(place_name) == 0: return False

    return True

transfer_rule = {}
transfer_rule['tourist_attraction'] = ['spot', 'attraction', 'landmark', 'sculpture', 'tourist', 'boutique']
transfer_rule['park'] = ['park', 'garden']
transfer_rule['restaurant'] = ['restaurant', 'tea house']
transfer_rule['snack'] = ['tea']
transfer_rule['museum'] = ['museum']
transfer_rule['worship'] = ['temple', 'worship']
transfer_rule['natural_feature'] = ['hiking', 'beach']
transfer_rule['store'] = ['store']
transfer_rule['hotel'] = ['hotel']

cate2type = {}
for type_tmp, cate_lt in transfer_rule.items():
    for cate in cate_lt:
        cate2type[cate] = type_tmp

def categories_transfer(categories):
    if categories == None:
        return ['point_of_interest']
    n_types = []
    for cate in categories:
        for n_cate, n_type in cate2type.items():
            if n_cate in cate.lower():
                n_types.append(n_type)

        for unit in cate.lower().split(' '):
            if unit in transfer_rule:
                n_types.append(transfer_rule[unit])
                
    n_types += categories
    if len(n_types) == 0:
        n_types.append('poi1nt_of_interest')

    return n_types


def check_server_living(flask_app_url):
    flag = False
    check_alive_endpoint = "/check_alive"

    # Make a GET request to the check_alive endpoint
    response = requests.get(f"{flask_app_url}{check_alive_endpoint}")

    # Check if the response status code is 200 (OK)
    if response.status_code == 200:
        try:
            # Parse the JSON response
            json_data = response.json()
            print("Server is alive!")
            print("Response JSON:", json_data)
            flag = True
        except ValueError:
            print("Server returned a non-JSON response.")
    else:
        print(f"Server returned an unexpected status code: {response.status_code}")

    return flag

import csv
import glob

def check_xhs_info(city_name):

    csv_files_1 = glob.glob(f'../../../data/xhs_crawl_raw/{city_name}/notes/*.csv')

    # Get the list of CSV files from the second directory
    csv_files_2 = glob.glob(f'../../../data/xhs_crawl_raw/{city_name}/*/notes/*.csv')

    # Combine the two lists
    csv_files = csv_files_1 + csv_files_2

    # Iterate through each CSV file
    note_id_info = {}
    for file_path in csv_files:

        with open(file_path, 'r', newline='',  encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:

                note_id = row['\ufeffnote_id']
                
                note_id_info[note_id] = {}
                note_id_info[note_id]['title'] = row['title']
                note_id_info[note_id]['desc'] = row['desc']

                note_id_info[note_id]['liked'] = int(row['liked_count']) if row['liked_count'] != '' else 0
                note_id_info[note_id]['collected'] = int(row['collected_count']) if row['collected_count'] != '' else 0
                note_id_info[note_id]['commented'] = int(row['comment_count']) if row['comment_count'] != '' else 0
                note_id_info[note_id]['shared'] = int(row['share_count'])  if row['share_count'] != '' else 0
                note_id_info[note_id]['all_matches'] = []


    return note_id_info

import certifi
ca = certifi.where()

print('ca = ', ca)
from pymongo import MongoClient

def get_apikeys():
    client = MongoClient("mongodb+srv://@cluster0.cdqflg6.mongodb.net/?retryWrites=true&w=majority",     tls=True, tlsAllowInvalidCertificates=True)
    db = client['search']  # Replace 'your_database_name' with your actual database name
    ngrok_urls_collection = db['ngrok_urls']


    tmp = []
    for k in range(1, 11):
        api = ngrok_urls_collection.find_one({'_id': 'search_' + str(k)})
        tmp.append(api)

    api_keys = []
    for api_data in tmp:
        url = None
        if api_data is not None:
            url = api_data['url']
        api_keys.append(url)

    return api_keys

import requests

def check_api_alive(url):
    # Use requests library to check if the server is alive
    api_url = f"{url}/check_alive"
    response = requests.get(api_url)

    if response.status_code == 200 and response.json().get('status') == 'alive':
        return {'status': 'Server is alive'}
    else:
        return {'status': 'Server is not responding'}


from opencc import OpenCC

def traditional_to_simplified(traditional_text):
    # Create an OpenCC converter for traditional to simplified conversion
    cc = OpenCC('t2s')

    # Perform the conversion
    simplified_text = cc.convert(traditional_text)

    return simplified_text


def getcity_corrd(city_name):
    cities_coordinates = {
        'chicago': (41.8781, -87.6298),
        'pittsburgh': (40.4406, -79.9959),
        'san jose': (37.3382, -121.8863),
        'seattle': (47.6062, -122.3321),
        'las vegas': (36.1699, -115.1398),
        'Miami': (25.7617, -80.1918),
        'LA': (34.0522, -118.2437),
        '辛辛那提': (39.1031, -84.5120),
        '奧蘭多': (28.5383, -81.3792),
        '紐約': (40.7128, -74.0060),
        '休士頓': (29.7604, -95.3698),
        '達拉斯': (32.7767, -96.7970),
        '哥倫布': (39.9612, -82.9988),
        'colorado': (39.7392, -104.9903),
        '費城': (39.9526, -75.1652),
        '多倫多': (43.6532, -79.3832), 
        'niagarafalls': (43.0962, -79.0377),
        '猶他': (40.7608, -111.8910),
        '克里夫蘭': (41.4993, -81.6944),
        '鹽湖城': (40.7608, -111.8910),
        '佛羅里達': (27.9944, -81.7603),
        '夏威夷': (20.7961, -156.3319),
        '底特律': (42.3314, -83.0458),
        'wisconsin': (43.7844, -88.7879),
        '密歇根': (44.3148, -85.6024),
        'san francisco': (37.7749, -122.4194),
        'washington': (38.8951, -77.0364),
        '台北': (25.0320, 121.5654),  # Taipei
        'palm spring': (33.8303, -116.5453),  # Palm Springs       
        'Washington': (38.8951, -77.0364),  # Washington, D.C.
        'santa barbara': (34.4208, -119.6982),
        'solvang': (34.5958, -120.1370),
        'irvine': (33.6846, -117.8265),
        'salinas': (36.6777, -121.6555),
        '嘉義': (23.4791, 120.4472),  # Coordinates for Chiayi
        '嘉義梅山': (23.5748, 120.5554),  # Coordinates for Chiayi
        '南投': (23.9139, 120.6636), 
        '大霧山國家公園': (35.63496, -83.5434),
        '錫安國家公園': (37.3115, -113.0268),
        '黃石國家公園': (44.5023, -110.6111),
        '洛磯山國家公園': (40.3542, -105.6813),
        '大堤頓國家公園': (43.8087, -110.6734),
        '優勝美地國家公園': (37.8881, -119.5290),
        '冰川國家公園': (48.7770, -113.7803),
        '約書亞樹國家公園': (33.8992, -115.8868),
        '奧林匹克國家公園': (47.8189, -123.6125),
        '布萊斯峽谷國家公園': (37.5994, -112.1798),
        '瑞尼爾山國家公園': (46.8876, -121.7251),
        '仙納度國家公園': (38.4899, -78.4560),
        '夏威夷火山國家公園': (19.5183, -155.4669),
        '紅杉國家公園': (36.5050, -118.5554),
        '哈萊阿卡拉國家公園': (20.7272, -156.1532),
        '白沙國家公園': (32.8027, -106.3366),
        '火山口湖國家公園': (42.9426, -122.1300),
        '仙人掌國家公園': (32.3062, -111.1656),
        '大沙丘國家公園': (37.8008, -105.5940),
        '羚羊谷': (37.6527, -111.5084)
    }

    return cities_coordinates[city_name]


def save_entity_json(entity_link, city):
    # Save read_info as JSON file
    seen_file_path = pathlib.Path(f'entity_link/{city}/') / f'seen_{city}.json'
    seen_file_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(seen_file_path, 'w', encoding='utf-8') as file:
        json.dump(entity_link, file, ensure_ascii=False, indent=2)

def read_cache_json(city):
    entity_link = {}

    seen_file_path = pathlib.Path(f'entity_link/{city}/') / f'seen_{city}.json'
    if os.path.exists(seen_file_path):
        with open(seen_file_path, 'r', encoding='utf-8') as file:
            entity_link = json.load(file)

    return entity_link



from fuzzywuzzy import fuzz


def calculate_overall_similarity_ratio(place_name, name, threshold=90):
    place_name_words = place_name.lower().split()
    name_words = name.lower()

    # Calculate similarity ratios for each pair of words
    word_scores = [fuzz.partial_ratio(word1, name_words) for word1 in place_name_words]

    for word_score in word_scores:
        if word_score < threshold:
            return threshold - 10

    return threshold + 10

def get_type_filter(place_file_name):
    place_type = ""
    place_type_not = "travel_agency,postal_code"

    if any(keyword in place_file_name for keyword in ['燈光秀', '活動']):
        place_type_not += ',restaurant'

    if any(keyword in place_file_name for keyword in ['登山', 'hiking']):
        place_type_not += ',store'

    if any(keyword in place_file_name for keyword in ['日本料理', '美食', '火鍋', '中餐']):
        # place_type += 'building,restaurant,point_of_interest'
        place_type_not += ',resort'

    return place_type, place_type_not

def rank_places(google_info_dic):
    ranked_place = {}

    for place_name in google_info_dic:

        place_data = google_info_dic[place_name]
        location = place_data['geometry']['location']

        lat, lng = location['lat'], location['lng']
        position = (lat, lng)

        rating = place_data['rating']
        rating = rating if rating != None else 0

        reviews = place_data['reviews']
        reviews = reviews if reviews != None else 0
        notes_to_keywords = place_data['notes_to_keywords']
        if position not in ranked_place:
            ranked_place[position] = {'rating': rating, 'reviews': reviews, 'notes_to_keywords': notes_to_keywords,
            'valid': place_data['valid']}

        ranked_place[position]['valid'] = ranked_place[position]['valid'] and place_data['valid']
        ranked_place[position]['rating'] = max(ranked_place[position]['rating'], rating)
        ranked_place[position]['reviews'] = max(ranked_place[position]['reviews'], reviews)
        for note_id in notes_to_keywords:
            keyword_set_tmp = notes_to_keywords[note_id]
            if note_id not in ranked_place[position]['notes_to_keywords']:
                ranked_place[position]['notes_to_keywords'][note_id] = keyword_set_tmp

    for position in ranked_place:
        rating = ranked_place[position]['rating']
        reviews = ranked_place[position]['reviews']
        place_valid = ranked_place[position]['valid']

        notes_num = 0
        for note_id, keyword_set in ranked_place[position]['notes_to_keywords'].items():
            keyword, word_match_valid, _, _ = keyword_set
            if word_match_valid is not False:
                notes_num += 1

        score = notes_num * 8000 + reviews
        if place_valid == False:
            score -= 1000000000

        ranked_place[position]['score'] = score

    ranked_place ={k: v for k, v in sorted(ranked_place.items(), key=lambda item: item[1]['score'], reverse = True)}

    k = 0

    for position in ranked_place:
        if k <= len(ranked_place) / 10:
            ranked_place[position]['star'] = True
        else:
            ranked_place[position]['star'] = False
        k += 1

    for place_name in google_info_dic:

        place_data = google_info_dic[place_name]
        location = place_data['geometry']['location']

        lat, lng = location['lat'], location['lng']
        position = (lat, lng)

        google_info_dic[place_name]['top_ranked'] = False
        if ranked_place[position]['star']:
            google_info_dic[place_name]['top_ranked'] = True


def filter_places(google_info_dic):

    forbidden_place_name = ['Chicago', 'Colorado', 'Los Angeles', 'Las Vegas', 'Miami', 
        'Pittsburgh', 'San Jose', 'Houston',  "Columbus", "New York", "Taipei City", "Taipei", "New Taipei City", "Palm Springs", "Solvang", "Solvang Vintage Motorcycle Museum",
        "Santa Barbara", 'Salinas']

    for place_name in forbidden_place_name:
        if place_name in google_info_dic:
            del google_info_dic[place_name]

from functools import lru_cache
from multiprocessing import Pool
from fuzzywuzzy import fuzz

def process_keyword_info(google_info_dic, match_result, note_id_info):

    for place_name in google_info_dic:
        place_data = google_info_dic[place_name]
        notes_to_keywords = place_data['notes_to_keywords']
        for note_id, keyword_set in notes_to_keywords.items():
            keyword, word_match_valid, _, _ = keyword_set
            if word_match_valid is False and keyword in match_result:
                notes_to_keywords[note_id][1] = match_result[keyword]


    @lru_cache(maxsize=32)
    def find_max_fuzzy_match_index(note_id, keyword):
        max_score = 0
        max_index = None

        longer_string = note_id_info[note_id]['desc']
        for i in range(len(longer_string) - len(keyword) + 1):
            current_substring = longer_string[i:i+len(keyword)]
            score = fuzz.ratio(keyword, current_substring)

            if score > max_score + 10:
                max_score = score
                max_index = i

        return max_index

    for place_name in google_info_dic:
        place_data = google_info_dic[place_name]
        notes_to_keywords = place_data['notes_to_keywords']
        for note_id, keyword_set in notes_to_keywords.items():
            keyword, _, _, _ = keyword_set
            # found_idx = find_max_fuzzy_match_index(note_id, keyword)
            keyword_set[-1] = -1

