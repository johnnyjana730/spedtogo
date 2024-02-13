import pickle
import pandas as pd
from utils import *
from utils_group import *
import argparse
from fuzzywuzzy import fuzz
from geopy.distance import great_circle
import requests
from collections import defaultdict
from pypinyin import pinyin, lazy_pinyin, Style
import pydash


def sorted_noteId_keyword_info(noteId_entities, note_id_info):


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

    for note_id in noteId_entities:
        keyword_idx_lt = []
        for keyword in noteId_entities[note_id]:
            max_index = find_max_fuzzy_match_index(note_id, keyword)
            keyword_idx_lt.append([max_index, keyword])

        keyword_idx_lt = sorted(keyword_idx_lt, key=lambda x: (x[0]))
        tmp = [keyword for idx, keyword in keyword_idx_lt]
        noteId_entities[note_id] = tmp


def all_note_entites(all_place_info):

    noteId_entities = {}
    keyword_place = {}
    
    extractedData = {}

    for google_info_dic in all_place_info:
        for place_name in google_info_dic:
        
            if 'valid' not in google_info_dic[place_name]:
                continue
            valid = google_info_dic[place_name]["valid"]
            if valid == False:
                continue

            notes_to_keywords = google_info_dic[place_name]["notes_to_keywords"]

            notes_to_keywords_valid = {}
            for note_id, keyword_set in notes_to_keywords.items():
                keyword, word_match_valid, _, _ = keyword_set
                if word_match_valid == False:
                    continue

                keyword_place[keyword] = place_name

                if note_id not in noteId_entities:
                    noteId_entities[note_id] = set()
                noteId_entities[note_id].add(keyword)

                notes_to_keywords_valid[note_id] = keyword_set


            if len(notes_to_keywords_valid) > 0:
                # if place_name is recorded
                if place_name in extractedData:
                    noteKeyInfo = extractedData[place_name]['noteKeyInfo']
                    for note_id, keyword_set in noteKeyInfo.items(): 
                        if note_id not in notes_to_keywords_valid:
                            notes_to_keywords_valid[note_id] = keyword_set

                google_info_dic[place_name]['notes'] = [noteid for noteid in notes_to_keywords_valid]
                google_info_dic[place_name]['noteKeyInfo'] = notes_to_keywords_valid

                extractedData[place_name] = google_info_dic[place_name]


    for note_id in noteId_entities:
        noteId_entities[note_id] = list(noteId_entities[note_id])


    n_extractedData = {}
    for place_name in extractedData:
        placeData = extractedData[place_name]

        place_types = placeData['types']

        # Default type if none of the conditions are met
        place_type = 'other'

        if 'restaurant' in place_types:
            place_type = 'restaurant'
        elif 'museum' in place_types:
            place_type = 'museum'
        elif 'park' in place_types:
            place_type = 'park'
        elif 'natural_feature' in place_types:
            place_type = 'natural_feature'
        elif 'place_of_worship' in place_types:
            place_type = 'worship'
        elif 'church' in place_types:
            place_type = 'church'
        elif 'tourist_attraction' in place_types:
            place_type = 'attraction'

        n_noteKeyInfo = {}
        for note_id in placeData['noteKeyInfo']:
            n_noteKeyInfo[note_id] = {}
            n_noteKeyInfo[note_id]['matchKeyword'] = placeData['noteKeyInfo'][note_id][0]
            n_noteKeyInfo[note_id]['title'] = placeData['noteKeyInfo'][note_id][2]

        n_extractedData[place_name] = {
            "place_name": place_name,
            'lat': placeData['geometry']['location']['lat'],
            'lng': placeData['geometry']['location']['lng'],
            'rating': placeData['rating'] if 'rating' in placeData else 'N/A',
            'noteKeyInfo': n_noteKeyInfo,
            'notes': placeData['notes'],
            'type': place_type,
            'top_ranked': placeData['top_ranked'] if 'top_ranked' in placeData else False,
        }


    return noteId_entities, keyword_place, n_extractedData


def gather_all_place_data(place_file_names, city_name):

    all_place_info = []

    for place_file_name in place_file_names:
        place_file_name = city_name + ' ' + place_file_name
        place_info = load_place_result(city_name, place_file_name)
        if len(place_info) > 0:
            all_place_info.append(place_info)

    return all_place_info



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

    # Use nargs to specify the number of arguments for city_coords
    parser.add_argument("--city_coords", help="Coordinates of the city (latitude and longitude)", nargs=2, type=float)

    args = parser.parse_args()
    city_name = args.city_name.strip()
    place_file_names = args.place_file_names.strip().split(',')


    note_id_info = check_xhs_info(city_name)

    all_place_info = gather_all_place_data(place_file_names, city_name)

    noteId_entities, keyword_place, place_NoteId = all_note_entites(all_place_info)

    sorted_noteId_keyword_info(noteId_entities, note_id_info)

    city_place_data = [noteId_entities, keyword_place, place_NoteId]

    save_city_place_data(city_name, city_place_data)