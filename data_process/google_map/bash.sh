#!/bin/bash

# Set the encoding to UTF-8
export LC_ALL=C.UTF-8

# 1. open colab notebook 2. set place_file_name and type info 
# 3. filter result by type info and similarity_ratio(todo) 4. bash bash.sh 
# todo run loop use api queue.

run_python_script() {
    python main_api.py \
        --place_file_names "$1" \
        --city_name "$2" \
        --MAX_DISTANCE $3 \
        --fuzz_threshold $4 


    python main_note_entity.py \
        --place_file_names "$1" \
        --city_name "$2" \
        --MAX_DISTANCE $3 \
        --fuzz_threshold $4
}


cd google_maps_scraper

MAX_DISTANCE=300


# 美國西部
cities="LA,san jose,las vegas,san francisco,seattle,猶他,鹽湖城,palm spring,irvine,"
# cities="santa barbara,solvang,irvine,salinas,"

# 美國東部
cities+="pittsburgh,紐約,費城,Washington,佛羅里達,Miami,哥倫布,奧蘭多,克里夫蘭,底特律,"

# 美國中部
cities+="chicago,colorado,休士頓,達拉斯,辛辛那提,密歇根,"

# 加拿大
cities+="多倫多,niagarafalls,"

# 太平洋地區
cities+="嘉義,南投,台北,夏威夷,"


# # 國家公園
# cities="冰川國家公園,紅杉國家公園,"
# cities="大霧山國家公園,錫安國家公園,黃石國家公園,洛磯山國家公園,大堤頓國家公園,優勝美地國家公園,冰川國家公園,約書亞樹國家公園,奧林匹克國家公園,布萊斯峽谷國家公園,瑞尼爾山國家公園,仙納度國家公園,夏威夷火山國家公園,紅杉國家公園,哈萊阿卡拉國家公園,白沙國家公園,火山口湖國家公園,仙人掌國家公園,大沙丘國家公園,羚羊谷"


# cities="大霧山國家公園,錫安國家公園,黃石國家公園,洛磯山國家公園,大堤頓國家公園,優勝美地國家公園,冰川國家公園,約書亞樹國家公園,奧林匹克國家公園,布萊斯峽谷國家公園,瑞尼爾山國家公園,仙納度國家公園,夏威夷火山國家公園,紅杉國家公園,哈萊阿卡拉國家公園,白沙國家公園,火山口湖國家公園,仙人掌國家公園"


cities="LA"

IFS=',' read -ra city_array <<< "$cities"
for city_name in "${city_array[@]}"; do
    echo $city_name
    # # Run the Python script for each city
    place_file_names='2月活動,活動1月,malibu,景點,打卡,拍照,火鍋,燈光秀,登山,hiking,日本料理,美食,火鍋,中餐,飲料,甜點,西班牙菜,法餐,brunch,牛排'
    fuzz_threshold=80

    run_python_script "$place_file_names" "$city_name" $MAX_DISTANCE $fuzz_threshold

done

