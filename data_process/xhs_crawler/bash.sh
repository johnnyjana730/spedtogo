#!/bin/bash


# Set the encoding to UTF-8
export LC_ALL=C.UTF-8

cd MediaCrawler

# Set the cookies variable (replace 'your_cookies' with the actual value)
lt_method="cookie"
# lt_method="cookie"
# keywords='1月活動,打卡,拍照,燈光秀,登山,hiking,火鍋,中餐,日本料理,美食,景點,住宿,airbnb'
# keywords='2月活動,打卡,拍照,燈光秀,登山,hiking,火鍋,中餐,日本料理,美食,景點,飲料,甜點'
# keywords='活動1月,飲料,甜點'

# keywords="美食,飲料,甜點"
# keywords="西班牙菜,法餐,brunch,牛排"
keywords="活動2月"

# LA
# cities="LA"
# subarea="Sawtelle,Beverly,Koreatown,Chinatown,hollywood,Culver city,little tokyo,Monterey Park,Glendale,San Gabriel,Pasadena,Alhambra,Temple City,Arcadia"

# 美國西部
cities="LA,san jose,las vegas,san francisco,seattle,猶他,鹽湖城,palm spring,irvine,"
# # cities="santa barbara,solvang,irvine,salinas,"

# # 美國東部
cities+="pittsburgh,紐約,費城,Washington,佛羅里達,Miami,哥倫布,奧蘭多,克里夫蘭,底特律,"

# # 美國中部
cities+="chicago,colorado,休士頓,達拉斯,辛辛那提,密歇根,"

# # 加拿大
cities+="多倫多,niagarafalls,"

# # 太平洋地區
cities+="嘉義,南投,台北,夏威夷,"
# cities+="嘉義梅山"

# TODO
# cities="波士頓,亞特蘭大,南卡,北卡,田納西,新墨西哥,亞利桑那,德州,阿拉斯加,密爾沃基,聖地牙哥"

# keywords='打卡,拍照,登山,hiking,美食,景點'

# # # 國家公園
# cities="大霧山國家公園,錫安國家公園,黃石國家公園,洛磯山國家公園,大堤頓國家公園,優勝美地國家公園,冰川國家公園,約書亞樹國家公園,奧林匹克國家公園,布萊斯峽谷國家公園,瑞尼爾山國家公園,仙納度國家公園,夏威夷火山國家公園,紅杉國家公園,哈萊阿卡拉國家公園,白沙國家公園,火山口湖國家公園,仙人掌國家公園,大沙丘國家公園,羚羊谷"



# IFS=',' read -ra city_array <<< "$cities"
# IFS=',' read -ra area_array <<< "$subarea"
# for city in "${city_array[@]}"; do
#     # Run the Python script for each city
#     for subarea in "${area_array[@]}"; do
#         python main.py --platform xhs --keywords "$keywords" --lt $lt_method --city "$city" --subarea "$subarea"
#     done
# done 

IFS=',' read -ra city_array <<< "$cities"
for city in "${city_array[@]}"; do
    # Run the Python script for each city
    python main.py --platform xhs --keywords "$keywords" --lt $lt_method --city "$city" --subarea "$subarea"
done 


