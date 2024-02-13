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

# nltk.download('punkt')  # Download the Punkt tokenizer models


def find(x, group_info):
    if group_info[x] != x:
        group_info[x] = find(group_info[x], group_info)
    return group_info[x]

def union(x, y, group_info):
    group_info[find(x, group_info)] = find(y, group_info)


def load_place_result(city_name, file_name):
    place_info = {}
    file_path = pathlib.Path(f"../../../data/Google_map/{city_name}/{file_name}.json")

    if file_path.exists():
        with open(file_path, 'r', encoding="utf8") as file:
            place_info = json.load(file)

    return place_info


def save_city_place_data(city_name, city_place_data):
    # Use pickle.dump to save the dictionary to the file
    file_name = city_name + '_info'
    pathlib.Path(f'../../../data/Google_map/{city_name}/' ).mkdir(parents=True, exist_ok=True)
    with open(f'../../../data/Google_map/{city_name}/{file_name}.json', "w", encoding='utf-8') as json_file:
        json.dump(city_place_data, json_file, ensure_ascii=False, indent=2)
