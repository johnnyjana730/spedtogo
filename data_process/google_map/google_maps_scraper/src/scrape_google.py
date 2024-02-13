import hashlib
import os
import urllib.parse
import sys

# Get the path of the current script
# current_script_path = os.path.abspath(__file__)

# # Get the parent directory of the current script
# parent_directory = os.path.dirname(current_script_path)

# # Add the parent directory to sys.path
# sys.path.insert(0, parent_directory)

sys.path.append("..")

from botasaurus_v2.botasaurus import *
from src.scrape_google_maps_places_task import ScrapeGoogleMapsPlacesTask
from .config import number_of_scrapers, queries
from botasaurus_v2.botasaurus.utils import read_json
import pydash

div_mapping = {}
div_mapping["SPZz6b"] = "NA_right_map_title"
div_mapping["I6TXqe"] = "NA_right_map_result"
div_mapping["aiAXrc"] = "NA_mid_map_title"


div_mapping["DoxwDb"] = "NA_right_map_title"
div_mapping["TQc1id"] = "NA_right_map_result"
div_mapping["aiAXrc"] = "NA_mid_map_title"


def divide_list(input_list, num_of_groups=6, skip_if_less_than=20):
    if skip_if_less_than is not None and len(input_list) < skip_if_less_than:
        return [input_list]

    group_size = len(input_list) // num_of_groups
    remainder = len(input_list) % num_of_groups

    divided_list = []
    for i in range(num_of_groups):
        start_index = i * group_size
        end_index = start_index + group_size
        divided_list.append(input_list[start_index:end_index])

    if remainder:
        for i in range(remainder):
            element = input_list[-i - 1]
            idx = i % num_of_groups
            print(idx, element)
            divided_list[idx].append(element)

    return divided_list


def sort_dict_by_keys(dictionary, keys):
    new_dict = {}
    for key in keys:
        new_dict[key] = dictionary[key]
    return new_dict


def clean(data_list, query):
    keys = 'ALL'

    if keys == 'ALL':
        keys = ["title", "link", "main_category", "categories", "rating", "reviews",  "address",  "cordinates"]
    new_results = data_list

    new_results = [sort_dict_by_keys(x, keys) for x in new_results]

    return new_results


class ScrapeGoogleSearch(BaseTask):

    task_config = TaskConfig(output_filename="all",
                             log_time=False,
                             close_on_crash=True
                             )

    browser_config = BrowserConfig(
        # block_images_fonts_css=True,
        # Do not make it eager as it leads to the loss of fields and previous data get used instead of new one.
        # is_eager=True,
        headless=True,
    )


    def __init__(self, city = '', queries = [],  task_config=None, browser_config=None):
        super().__init__()

        self.city = city
        self.queries = queries

    def save_google(self, driver, data):
        data = {"links": data, "query": {
            'keyword': 'rama',
            "sort": {
                "by": "title",
                "order": "desc"
            }
        }}

        return ScrapeGoogleMapsPlacesTask().run(driver, data)

    def get_data(self):
        result = []
        
        for query in self.queries:

            keyword = query["keyword"]
            print('keyword = ', keyword)
            keyword_kebab = pydash.kebab_case(keyword)
            filepath = os.path.join("output", keyword_kebab + ".json")
            stored = LocalStorage.get_item(keyword_kebab)
            if stored is None:
                result.append(query)
            else:
                if os.path.exists(filepath):
                    with open(filepath, 'r') as f:
                        file_content = f.read()
                        file_hash = hashlib.md5(file_content.encode()).hexdigest()                      

                    stored_query = stored['query']
                    stored_hash = stored['hash']

                    if stored_query == query and stored_hash == file_hash:
                        # print(f'Skipping query "{keyword}" as it is already scraped.') 
                        result.append({"filepath": filepath, "keyword": keyword})
                    else:
                        result.append(query)
                else:
                    result.append(query)
                
        return result, self.city
        
    def run(self, driver, data):
        if "filepath" in data:
            new_results =  read_json(data["filepath"])
            return new_results

        keyword = data['keyword']
        keyword_kebab = pydash.kebab_case(keyword)

        driver.get_google()
        driver.get("https://www.google.com/search?q=" + keyword)
        content_selector = "div.v7W49e"
        new_results = driver.text(content_selector)


        try:
            content_selector = "div.xQjRM"
            new_results += "***********"
            new_results += driver.text(content_selector)
        except:
            pass

        try:
            content_selector = "div.I6TXqe"
            new_results += "***********"
            new_results += driver.text(content_selector)
        except:
            pass


        for div_pt in ['TQc1id', 'HdbW6', 'VkpGBb', 'tNxQIb', "SPZz6b", 'hHq9Z']:
            try:
                content_selector = "div." + div_pt
                new_results += "***********"
                new_results += driver.text(content_selector)
            except:
                pass

        # NA_right_map_title = ""
        # NA_right_map_result = ""
        # NA_mid_map_title = ""

        # for div_pt in ['DoxwDb', "SPZz6b"]:
        #     content_selector = "div." + div_pt
        #     # new_results += "***********" + div_mapping[div_pt] + ':'
        #     try:
        #         tmp = driver.text(content_selector)
        #         if len(tmp) > 0:
        #             NA_right_map_title = tmp
        #     except:
        #         pass
        #     # new_results += "***********"

        # for div_pt in ['TQc1id', "I6TXqe"]:
        #     content_selector = "div." + div_pt
        #     try:
        #         tmp = driver.text(content_selector)
        #         if len(tmp) > 0:
        #             NA_right_map_result = tmp
        #     except:
        #         pass

        # for div_pt in ['aiAXrc']:
        #     content_selector = "div." + div_pt
        #     try:
        #         tmp = driver.text(content_selector)
        #         if len(tmp) > 0:
        #             NA_mid_map_title = tmp
        #     except:
        #         pass
        
        # new_results += "***********NA_right_map_title:" + NA_right_map_title + "***********"
        # new_results += "***********NA_right_map_result:" + NA_right_map_result + "***********"
        # new_results += "***********NA_mid_map_title:" + NA_mid_map_title + "***********"


        # for div_pt in ['aiAXrc']:
        #     content_selector = "div." + div_pt
        #     new_results += "***********" + div_mapping[div_pt] + ':'
        #     try:
        #         new_results += driver.text(content_selector)
        #     except:
        #         pass
        #     new_results += "***********"

        # div_mapping["SPZz6b"] = "NA_right_map_title"
        # div_mapping["I6TXqe"] = "NA_right_map_result"
        # div_mapping["aiAXrc"] = "NA_mid_map_title"


        # div_mapping["DoxwDb"] = "NA_right_map_title"
        # div_mapping["TQc1id"] = "NA_right_map_result"
        # div_mapping["aiAXrc"] = "NA_mid_map_title"

        # div_mapping["PZPZlf"] = "北美右map_title"
        # div_mapping["aiAXrc"] = "北美中map_title"
        # div_mapping["I6TXqe"] = "北美右map_result"

        # print('new_results = ', new_results)
        # result = self.parallel(
        # #     self.save_google, divided_list, len(divided_list))
        # fetched_results = pydash.flatten(result)

        # # print('fetched_results = ', fetched_results)
        # new_results = clean(fetched_results, data)

        if os.path.exists("output/search/" + self.city + '/') == False:
            os.makedirs("output/search/" + self.city + '/')

        Output.write_json(new_results, "search/" + self.city + '/' + pydash.kebab_case(keyword))
        # Output.write_csv(new_results, pydash.kebab_case(keyword))

        filepath = os.path.join("output/search/", self.city + '/' + keyword_kebab + ".json")
        with open(filepath, 'r') as f:
                file_content = f.read()
                file_hash = hashlib.md5(file_content.encode()).hexdigest()                      

        data_to_store = {
            "query": data,
            "hash": file_hash
        }
        LocalStorage.set_item(keyword_kebab, data_to_store)

        return new_results
