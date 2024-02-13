# Desc: base config

from .base_config import *
import glob
import pickle
import pandas as pd
import os


def generate_keywords():
	save_file = {}
	for path_name in glob.glob("C:\\Users\\Chang-YuTai\\speed2go\\MediaCrawler\\data\\xhs\\*.csv"):
		path_lt = path_name.split('\\')[-1]
		save_file[path_lt] = 1

	file_path = 'data/claude/data/japanesefood.pickle'
	if os.path.exists(file_path):
		with open(file_path, 'rb') as file:
			data = pickle.load(file)

		keywods = ["LA " + key.replace('\n', "").replace('/', "") for key in data if len(key) > 3]
		n_keywords = []
		
		for key in keywods:
			flag = False
			for path_lt in save_file:
				if key in path_lt:
					flag = True
			if flag == False:
				n_keywords.append(key)

		# print('n_keywords = ', n_keywords)
		# input()
		return n_keywords

	return []
