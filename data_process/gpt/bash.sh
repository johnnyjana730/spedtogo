#!/bin/bash

# 1. open colab notebook 2. set city_name and note file (from MediaCrawler) 
# 3. run ./bash.bat (地名 main_viewpt_glm.py 餐廳 main_rest_glm.py)
# todo update using better gpt model

# 美國西部
# cities="LA,san jose,las vegas,san francisco,seattle,猶他,鹽湖城,palm spring,irvine,"
# # cities="santa barbara,solvang,irvine,salinas,"

# # 美國東部
# cities+="pittsburgh,紐約,費城,Washington,佛羅里達,Miami,哥倫布,奧蘭多,克里夫蘭,底特律,"

# # 美國中部
# cities+="chicago,colorado,休士頓,達拉斯,辛辛那提,密歇根,"

# # 加拿大
# cities+="多倫多,niagarafalls,"

# # 太平洋地區
# cities+="嘉義,南投,台北,夏威夷,"


# keywords='打卡,拍照,登山,hiking,美食,景點'

# # 國家公園
# cities="大霧山國家公園,錫安國家公園,黃石國家公園,洛磯山國家公園,大堤頓國家公園,優勝美地國家公園,冰川國家公園,約書亞樹國家公園,奧林匹克國家公園,布萊斯峽谷國家公園,瑞尼爾山國家公園,仙納度國家公園,夏威夷火山國家公園,紅杉國家公園,哈萊阿卡拉國家公園,白沙國家公園,火山口湖國家公園,仙人掌國家公園,大沙丘國家公園,羚羊谷"


api_num=1

cities="LA"

IFS=',' read -ra city_array <<< "$cities"
for city_name in "${city_array[@]}"; do
	echo $city_name

	# notes_names='1月活動,2月活動,malibu,打卡,拍照,燈光秀,登山,景點,hiking'
	# python main_glm.py --city_name "$city_name" --prompt_type "viewpt" --notes_names "$notes_names" --api_num $api_num

	# notes_names='美食,日本料理,中餐,火鍋,飲料,甜點''
	# python main_glm.py --city_name "$city_name" --prompt_type "restaurant" --notes_names "$notes_names" --api_num $api_num

	notes_names='西班牙菜,法餐,brunch,牛排'
	python main_glm.py --city_name "$city_name" --prompt_type "restaurant" --notes_names "$notes_names" --api_num $api_num

done

# # sub area LA
# cities="LA"
# subarea="Sawtelle,Beverly,Koreatown,Chinatown,hollywood,Culver city,little tokyo,Monterey Park,Glendale,San Gabriel,Pasadena,Alhambra,Temple City,Arcadia"


# IFS=',' read -ra city_array <<< "$cities"
# IFS=',' read -ra area_array <<< "$subarea"
# for city in "${city_array[@]}"; do
#     # Run the Python script for each city
#     for subarea in "${area_array[@]}"; do
# 		notes_names='美食,飲料,甜點'
# 		python main_glm.py --city_name "$city" --sub_area "$subarea" --prompt_type "restaurant" --notes_names "$notes_names" --api_num 1
#     done
# done 
