# Install the client library and import necessary modules.
#!pip install google-generativeai
import google.generativeai as genai
import json
import pathlib
import pprint
import requests
import mimetypes
from IPython.display import Markdown

from utils import *
import json

API_KEY=''

# Configure the client library by providing your API key.
genai.configure(api_key=API_KEY)

model = 'gemini-pro' # @param {isTemplate: true}
generation_config = "{}" # @param {isTemplate: true}
safety_settings = "{}" # @param {isTemplate: true}

generation_config = json.loads(generation_config)
safety_settings = json.loads(safety_settings)

stream = False

# Call the model and print the response.
gemini = genai.GenerativeModel(model_name=model)


def call_gemini(read_info, model_input, api_num, f_input):  

    all_matches = []
    for tmper in [0.3, 0.8]:
        generation_config['temperature'] = tmper

        response = gemini.generate_content(
            f_input,
            generation_config=generation_config,
            safety_settings=safety_settings,
            stream=False)

        try:        
            response_text = response.text
            response_text = response_text.replace('\r', '')
            matches = process_response(response_text)

            print('tmper = ', tmper, 'matches = ', matches)
            all_matches += matches

        except Exception as e:
            print('response = ', response.candidates)
            print(f'An error occurred: {e}')

    return list(set(all_matches))
