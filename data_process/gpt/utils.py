import json
import csv
import re
import pandas as pd
import os
import pickle
import pathlib
import tempfile
import shutil
import asyncio, json
# from EdgeGPT.EdgeGPT import Chatbot, ConversationStyle
# from fp.fp import FreeProxy


def process_response(response):
    # 模式1: 匹配以数字后跟句點的列表項目，提取句點后的文字
    pattern = r'\d+\.\s+([^\n]+)'
    # 例子:
    # "1. Apple" => "Apple"

    # 模式2: 匹配以数字后跟句點的列表項目，提取句點后的文字，包括中文字符、字母、空格和單引號
    pattern2 = r'\d+\.\s+([\u4e00-\u9fa5A-Za-z\s\']+)'
    # 例子:
    # "2. 香蕉" => "香蕉"
    # "3. Mango" => "Mango's Fruit"

    # 模式3: 匹配以特殊表情符號📍和數字后跟序列（️⃣）的項目，提取表情符號后的文字
    pattern3 = r'📍\d+️⃣([\w\s\'-]+)'
    # 例子:
    # "📍1️⃣ Location A" => "Location A"

    # 模式4: 匹配以数字后跟句點的列表項目，提取句點后的文字，包括中文字符、字母和空格
    pattern4 = r'\d+\.\s+([\u4e00-\u9fa5A-Za-z\s]+)'
    # 例子:
    # "4. 桃子" => "桃子"

    # 模式5: 匹配以数字后跟一個或多個句點的列表項目，提取最后一个句點后的文字
    pattern5 = r'\d+\.+([^\n]+)'
    # 例子:
    # "5.. Final Item" => "Final Item"

    # 使用各種模式提取匹配的內容
    matches = re.findall(pattern, response)
    matches2 = re.findall(pattern2, response)
    matches3 = re.findall(pattern3, response)
    matches4 = re.findall(pattern4, response)
    matches5 = re.findall(pattern5, response)

    if len(matches2) > len(matches):
        matches = matches2
    
    if len(matches3) > len(matches):
        matches = matches3

    if len(matches4) > len(matches):
        matches = matches3

    if len(matches5) > len(matches):
        matches = matches5

    return matches


def process_match_lt(match_lt):
    matches = re.split(r'\s*(\d+\.)\s*', match_lt)
    result = []
    for match in matches:
        if len(match) == 2 and '.' in match: continue
        if len(match) <= 1: continue
        result.append(match)

    return result


def bot_generate():
    def getCookies(url):
        import browser_cookie3
        browsers = [
            # browser_cookie3.chrome,
            # browser_cookie3.chromium,
            # browser_cookie3.opera,
            # browser_cookie3.opera_gx,
            # browser_cookie3.brave,
            browser_cookie3.edge,
            # browser_cookie3.safari,
        ]
        for browser_fn in browsers:
            # if browser isn't installed browser_cookie3 raises exception
            # hence we need to ignore it and try to find the right one
            try:
                cookies = []
                cj = browser_fn(domain_name=url)
                for cookie in cj:
                    cookies.append(cookie.__dict__)
                return cookies
            except:
                continue

    # proxy = "socks5://" + load_proxy()
    # proxy =  FreeProxy(https=True).get()
    # print('proxy = ', proxy)
    bot = Chatbot(cookies=getCookies('.bing.com'))
    return bot

def load_rest_prompt(set_num):
    text_file_path = './prompt/rest/doc2rest_s' + str(set_num) + '.txt'
    prompt_content = ""
    with open(text_file_path, 'r', encoding='utf-8') as file:
        prompt_content = file.read()
    return prompt_content

def load_viewpt_prompt(set_num):
    text_file_path = './prompt/viewpoint/doc2viewpt_s' + str(set_num) + '.txt'
    prompt_content = ""
    with open(text_file_path, 'r', encoding='utf-8') as file:
        prompt_content = file.read()
    return prompt_content

def load_data_csv(city, sub_area, note_name):
    # csv_file_path = 'C://Users//Chang-YuTai//speed2go//data//xhs_crawl_raw//LA//notes//'
    # csv_file_path += note_name + ".csv"
    # C:\Users\Chang-YuTai\speed2go\data_process\gpt

    if len(sub_area) > 0:
        note_name = city.strip() + " " + sub_area + " " + note_name.strip()
        csv_file_path = f'../../data/xhs_crawl_raw/{city}/{sub_area}/notes/' + note_name + ".csv"  
    else:

        note_name = city.strip() + " " + note_name.strip()
        csv_file_path = f'../../data/xhs_crawl_raw/{city}/notes/' + note_name + ".csv"

    print('csv_file_path = ', csv_file_path)
    input_list = []
    node_id_list = []
    title_list = []
    title_note_id_list = []
    if os.path.exists(csv_file_path):
        with open(csv_file_path, 'r', newline='',  encoding='utf-8') as file:
            reader = csv.DictReader(file)
            context = ""
            for row in reader:
                # title = row['title']
                # input_list.append(title)
                # note_id = row['\ufeffnote_id']
                # node_id_list.append(note_id)

                desc = row['desc']
                input_list.append(desc)
                note_id = row['\ufeffnote_id']
                node_id_list.append(note_id)
    return input_list, node_id_list, title_list, title_note_id_list

def load_cache(note_name, city, set_num = 0):
    read_info = {}
    rest_name = {}

    file_path = 'tmp/seen/seen_' + note_name + "_s" + str(set_num) + ".pickle"
    if os.path.exists(file_path):
        read_info = pd.read_pickle(file_path)

    file_path = f'../../data/LLM_extract/{city}/' + note_name + ".pickle"
    if os.path.exists(file_path):
        rest_name = pd.read_pickle(file_path)

    return read_info, rest_name


def save_cache(note_name, city, rest_name, read_info, set_num  = 0):
    file_path = f'../../data/LLM_extract/{city}/' + note_name + ".pickle"
    pathlib.Path(f'../../data/LLM_extract/{city}/' ).mkdir(parents=True, exist_ok=True)
    with open(file_path, 'wb') as file:
        # Use pickle.dump to save the dictionary to the file
        pickle.dump(rest_name, file)

    file_path = 'tmp/seen/seen_' + note_name + "_s" + str(set_num) + ".pickle"
    with open(file_path, 'wb') as file:
        pickle.dump(read_info, file)

def save_cache_json(note_name, sub_area, city, rest_name, read_info, set_num  = 0):
    # Save rest_name as JSON file


    if len(sub_area):
        note_name = note_name.strip()
        rest_name_file_path = pathlib.Path(f'../../data/LLM_extract/{city}/{sub_area}/') / f'{note_name}.json'
    else:
        note_name = city.strip() + ' ' + note_name.strip()
        rest_name_file_path = pathlib.Path(f'../../data/LLM_extract/{city}/') / f'{note_name}.json'

    # if len(sub_area):
    #     note_name = sub_area + ' ' + note_name.strip()
    #     rest_name_file_path = pathlib.Path(f'../../data/LLM_extract/{city}/{sub_area}/') / f'{note_name}.json'

    rest_name_file_path.parent.mkdir(parents=True, exist_ok=True)

    with open(rest_name_file_path, 'w', encoding='utf-8') as file:
        json.dump(rest_name, file, ensure_ascii=False, indent=2)

    # Save read_info as JSON file
    # seen_file_path = pathlib.Path('tmp/seen/') / f'seen_{city}.json'
    # seen_file_path.parent.mkdir(parents=True, exist_ok=True)
    
    # with open(seen_file_path, 'w', encoding='utf-8') as file:
    #     json.dump(read_info, file, ensure_ascii=False, indent=2)

    try:

        # Save read_info as JSON file
        seen_file_path = pathlib.Path(f'output/{city}/') / f'seen_temps_{city}.json'

        seen_file_path.parent.mkdir(parents=True, exist_ok=True)

        # Use a temporary file
        temp_file_path = tempfile.mktemp(suffix='.json', dir=str(seen_file_path.parent))

        with open(temp_file_path, 'w', encoding='utf-8') as file:
            json.dump(read_info, file, ensure_ascii=False, indent=2)

        # Move the temporary file to the final location
        shutil.move(temp_file_path, seen_file_path)

    except Exception as e:
        print(f'An error occurred: {e}')


def read_cache_json(city):
    read_info = {}
    # seen_file_path = pathlib.Path('tmp/seen/') / f'seen_{city}.json'
    # if os.path.exists(seen_file_path):
    #     with open(seen_file_path, 'r', encoding='utf-8') as file:
    #         read_info = json.load(file)

    seen_file_path = pathlib.Path(f'output/{city}/') / f'seen_temps_{city}.json'
    if os.path.exists(seen_file_path):
        with open(seen_file_path, 'r', encoding='utf-8') as file:
            read_info = json.load(file)

    return read_info

def load_cache_json(note_name, city, set_num = 0):
    read_info = {}
    rest_name = {}

    file_path = 'tmp/seen/seen_temps_' + note_name + "_s" + str(set_num) + ".pickle"
    if os.path.exists(file_path):
        read_info = pd.read_pickle(file_path)

    file_path = f'../../data/LLM_extract/{city}/' + note_name + ".pickle"
    if os.path.exists(file_path):
        rest_name = pd.read_pickle(file_path)

    return read_info, rest_name



import random

def load_proxy():
    file_path = 'data/proxy/socks5.txt' # Replace with the path to your text file
    with open(file_path, 'r') as file:
        # Step 2: Read the lines of the file and save them into a list
        lines = file.readlines()
        
        # Step 3: Append each line to a list (optional: strip newline characters)
        lines_list = [line.strip() for line in lines]

        # Step 4: Close the file
        file.close()

    return random.choice(lines_list)

import requests


def send_info_to_llama(input_text, temperature=0.5, url = ""):
    
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "prompt": input_text,
        "max_tokens": 512,
        "top_k": 40,
    }
    if temperature != 0:
        data['temperature'] = temperature

    response = requests.post(url, headers=headers, json=data)
    # print('response = ', response)
    if response.status_code == 200:
        print("Response:")
        print(response.json())
        result = response.json()
        return result["choices"][0]['text']
    else:
        print("Error:", response.status_code, response.text)
        return None

# def send_info_to_llama(input_text, temperature=0.2, url = ""):

#     headers = {
#         "Content-Type": "application/json"
#     }

#     data = {
#         "prompt": input_text,
#         "max_tokens": 512,
#         "top_k": 40,
#     }

#     response = requests.post(url, headers=headers, json=data)
#     # print('response = ', response)
#     if response.status_code == 200:
#         print("Response:")
#         print(response.json())
#         result = response.json()
#         return result["choices"][0]['text']
#     else:
#         print("Error:", response.status_code, response.text)
#         return None

# {
#     "prompt": input_text,
#     "max_tokens": 512,
#     "temperature": temperature,
#     "top_k": 40,
# }

import openai
def send_info_to_glm(input_text, temperature=0.2, url = ""):
    openai.api_base = url
    openai.api_key = "none"

    response = ''
    for chunk in openai.ChatCompletion.create(
        model="chatglm3-6b",
        messages=[
            {"role": "user", "content": input_text, "temperature": temperature, 'max_tokens': 100}
        ],
        stream=True,
        max_tokens=200,
        temperature=temperature,
        newline=False
    ):
        if hasattr(chunk.choices[0].delta, "content"):
            response += chunk.choices[0].delta.content
            print(chunk.choices[0].delta.content, end="", flush=True)

    print()
    return response


def send_info_to_bluelm(input_text, temperature=0.5, url = ""):


    response = requests.get(f"{url}/api", params={'input_text': input_text})

    if response.status_code == 200:
        # try:
        data_list = response.json()

    return data_list


# def get_llm_processed_data(read_info, model_input, api_url, f_input):          
#     # for tmper in [0, 0.2, 0.4, 0.6, 0.8]:
#     all_matches = []
#     for tmper in [0.2, 0.5, 0.8]:
#         response = send_info_to_glm(f_input, temperature=tmper, url = api_url)
        
#         response = response.replace('\r', '')
#         matches = process_response(response)

#         all_matches += matches
#     return list(set(all_matches))


import requests
import time

def get_llm_processed_data(read_info, model_input, api_num, f_input):          
    # for tmper in [0, 0.2, 0.4, 0.6, 0.8]:
    
    api_url = get_apikey(api_num)

    while True:
        response = check_api_alive(api_url)
        if response['status'] == "Server is alive":
            break
        else:
            api_url = get_apikey(api_num)
            print('not alive = ', response)
            time.sleep(60)

    all_matches = []
    for tmper in [0.2, 0.5, 0.8]:
        response = send_info_to_glm(f_input, temperature=tmper, url = api_url + '/v1')
        
        response = response.replace('\r', '')
        matches = process_response(response)

        all_matches += matches
    return list(set(all_matches))



def check_api_alive(url):
    # Use requests library to check if the server is alive
    api_url = f"{url}/check_alive/"
    response = requests.get(api_url)

    if response.status_code == 200:
        return {'status': 'Server is alive'}
    else:
        return {'status': 'Server is not responding'}


from pymongo import MongoClient

def get_apikey(api_num = 1):
    client = MongoClient("mongodb+srv://johnnyjana730:DEcbw3EIB0CIjciD@cluster0.wxhtomw.mongodb.net/?retryWrites=true&w=majority")
    db = client['search']  # Replace 'your_database_name' with your actual database name
    ngrok_urls_collection = db['ngrok_urls']
    api_data = ngrok_urls_collection.find_one({'_id': 'LLM_' + str(api_num)})
    url = api_data['url']

    return url

import requests

from fuzzywuzzy import fuzz

def match_txt(match, model_input):
    partial_similarity_ratio = fuzz.partial_ratio(match.lower(), model_input.lower())
    flag = False
    match = re.sub(r"[\'\"]", "", match).lower().replace("'", "").replace("’", "").replace("‘", "")
    model_input = re.sub(r"[\'\"]", "", model_input).lower().replace("'", "").replace("’", "").replace("‘", "")
    if match in model_input:
        flag = True

    if partial_similarity_ratio >= 80:
        flag = True

    print('match , partial_similarity_ratio = ', match,  partial_similarity_ratio, flag)
    return flag
