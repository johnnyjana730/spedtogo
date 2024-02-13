import pickle
import pandas as pd
from utils import *
import argparse
from fuzzywuzzy import fuzz
from geopy.distance import great_circle

# import sys
# # Add a new directory to sys.path
# sys.path.insert(0, 'C://Users//Chang-YuTai//speed2go//data_process//google_map//google_maps_scraper//')

from src.scrape_google import ScrapeGoogleSearch
from src.scrape_google_maps import ScrapeGoogleMaps
from src.scrape_google_maps_links_task import ScrapeGoogleMapsLinksTask
from botasaurus_v2.botasaurus.launch_tasks import launch_tasks
from bose import LocalStorage


# Initialize the Google Maps client.
cur_loc = "Los Angeles "

queries = [
            {"keyword": "芝加哥+橋林", 'extracted_place_name': "博物館", 'xhs_note_list': ['123'], 'job_type': 'google_search'}, 
            {"keyword": "芝加哥+香天下", 'extracted_place_name': "廚尚", 'xhs_note_list': ['123'], 'job_type': 'google_search'}
          ]

def scrape_google_search_instance():
    return ScrapeGoogleSearch(queries=queries, city = "chicago")

outputs = launch_tasks(scrape_google_search_instance)

print('outputs = ', outputs)