import sys 
import re
import pandas as pd
import os

import argparse
import asyncio, json

from utils import *
from utils_gemini import call_gemini

from fuzzywuzzy import fuzz

def main(city, sub_area, note_name, prompt_p1, prompt_p2, api_num):

    print('city, sub_area, note_name = ', city, sub_area, note_name)
    # input_list, node_id_list = load_data_csv(city, note_name)
    input_list, node_id_list, title_list, title_note_id_list = load_data_csv(city, sub_area, note_name)
    rest_name = {}
    read_info = read_cache_json(city)

    # print('prompt_content = ', prompt_content)
    for model_input, node_id in zip(input_list, node_id_list):  
        f_input = prompt_p1
        f_input += "\n\n"
        f_input += model_input + "\n\n"
        f_input += prompt_p2
        print('f_input = ', f_input)

        # all_matches = read_info[model_input]
        # print('node_id = ', node_id)
        # if '6349e2c20' in node_id:
        #     print('model_input = ', model_input)
        #     input()
        if model_input not in read_info:
            # all_matches = get_llm_processed_data(read_info, model_input, api_num, f_input)
            all_matches = call_gemini(read_info, model_input, api_num, f_input)
            # print('all_matches = ', all_matches)
            # input()
            read_info[model_input] = all_matches
        all_matches = read_info[model_input]


        for match_lt in all_matches:
            for match in process_match_lt(match_lt):
                match = match.replace('\n', '')
                match = match.strip()


                while len(match) > 0 and match[-1] == ' ':
                    match = match[:-1]
                if '\n' in match:
                    match = match.split("\n")[0]

                if match_txt(match, model_input):
                    if match not in rest_name:
                        rest_name[match] = []
                    if node_id not in rest_name[match]:
                        rest_name[match].append(node_id)

        save_cache_json(note_name, sub_area, city, rest_name, read_info)

    for title, node_id in zip(title_list, title_note_id_list): 
        if title not in rest_name:
            rest_name[title] = []
        if node_id not in rest_name[title]:
            rest_name[title].append(node_id)

    print(rest_name)
    save_cache_json(note_name, sub_area, city, rest_name, read_info)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--notes_names",
        help="Prompt to generate images for",
        type=str
    )
    parser.add_argument(
        "--city_name",
        help="Prompt to generate images for",
        type=str
    )
    parser.add_argument(
        "--sub_area",
        help="Prompt to generate images for",
        type=str,
        default=""
    )

    parser.add_argument(
        "--api_url",
        help="Prompt to generate images for",
        type=str
    )
    parser.add_argument(
        "--prompt_type",
        help="Prompt to generate images for",
        type=str
    )
    parser.add_argument(
        "--api_num",
        help="Prompt to generate images for",
        type=str,
        default="1"
    )

    args = parser.parse_args()

    city_name = args.city_name
    sub_area = args.sub_area
    notes_names = args.notes_names.split(',')
    print('notes_names = ', notes_names)

    rest_prompt_p1 = load_rest_prompt(15)
    rest_prompt_p2 =  ""
    rest_prompt_p2 += "找出最後文章的餐廳名或地址 用數字分開 (1. 2. 3. ...)" + "\n"
    rest_prompt_p2 += "1. 川麻婆 2. 渔家重庆小面 3. 3235 S Halsted St, Chicago, IL 60608\n請繼續找出餐廳名或地址 (4. 5. ...)"

    viewpt_prompt_p1 = load_viewpt_prompt(10)
    viewpt_prompt_p2 = ""
    viewpt_prompt_p2 += "找出上文地名或地址 用數字分開 (1. 2. 3. ...)" + "\r\n"
    viewpt_prompt_p2 += "1. Glowland 2023🎆灯光秀 2. Oakland Innovation District\n請繼續找出上文地名或地址 (3. 4. ...)"

    if args.prompt_type == 'restaurant':
        prompt_p1 = rest_prompt_p1
        prompt_p2 = rest_prompt_p2
    else:
        prompt_p1 = viewpt_prompt_p1
        prompt_p2 = viewpt_prompt_p2

    for note_name in notes_names:
        main(city_name, sub_area, note_name, prompt_p1, prompt_p2, api_num = int(args.api_num) )