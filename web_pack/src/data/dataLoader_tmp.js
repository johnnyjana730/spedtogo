
import * as IconVariables from '../map/mapVariables';
const fs = require('fs').promises;

export async function loadPlacesData(city_name, fileName) {
  try {
    // const data = await import(`./${fileName}.json`);
    const n_fileName = city_name + ' ' + fileName;
    const data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`);

    console.log(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`)
    // Extract the desired information
    const extractedData = {};

    for (const key in data) {
      const placeData = data[key];
      const placeValid = placeData.valid;
      const notes_to_keywords = placeData.notes_to_keywords;

      const noteKeyInfo = {};
      // const new

      let keyword_matchflag = false;
      for (const noteKey in notes_to_keywords) {
        const noteValue = notes_to_keywords[noteKey][1];
        

        // Check if noteValue is not false
        if (noteValue !== false) {
          keyword_matchflag = true;

          noteKeyInfo[noteKey] = {
            matchKeyword: notes_to_keywords[noteKey][0],
            title: notes_to_keywords[noteKey][2],
          };
          // If you want to break out of the loop once a match is found, you can use "break" here.
        }
      }

      if (placeData.geometry && placeData.geometry.location && placeValid && keyword_matchflag) {

        let type = 'other'; // Default type if none of the conditions are met

        if (placeData.types.includes('restaurant')) {
          type = 'restaurant';
        } else if (placeData.types.includes('museum')) {
          type = 'museum';
        } else if (placeData.types.includes('park')) {
          type = 'park';
        } else if (placeData.types.includes('natural_feature')) {
          type = 'natural_feature';
        } else if (placeData.types.includes('place_of_worship')) {
          type = 'worship';
        } else if (placeData.types.includes('church')) {
          type = 'church';
        } else if (placeData.types.includes('tourist_attraction')) {
          type = 'attraction';
        }

        extractedData[key] = {
          place_name: key,
          lat: placeData.geometry.location.lat,
          lng: placeData.geometry.location.lng,
          rating: placeData.rating || 'N/A',
          noteKeyInfo: noteKeyInfo,
          notes: placeData.note || [],
          type: type,
        };
      }
    }
    return { extractedData};
  } catch (error) {
    throw new Error(`Error loading ${fileName}.json: ${error.message}`);
  }
}


export async function readNoteMatch(city_name) {

  const fileNames= ['景點', '拍照', '打卡', '11月活動', 'malibu', '燈光秀', '登山', 'hiking',
    '美食', '火鍋', '中餐', '日本料理'];

  const notes_matches = {};
  const ketword_matches = {};
  const extractedData = {};

  for (const fileName of fileNames) {
      const n_fileName = city_name + ' ' + fileName;

    try {
      
      const data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`);


      for (const key in data) {
        const placeData = data[key];
        const placeValid = placeData.valid;
        const notes_to_keywords = placeData.notes_to_keywords;

        const noteKeyInfo = {};
        // const new

        let keyword_matchflag = false;
        for (const noteKey in notes_to_keywords) {
          const noteValue = notes_to_keywords[noteKey][1];

          // Check if noteValue is not false
          if (noteValue !== false) {

            keyword_matchflag = true;

            noteKeyInfo[noteKey] = {
              matchKeyword: notes_to_keywords[noteKey][0],
              title: notes_to_keywords[noteKey][2],
            };

            if (!notes_matches[noteKey]) {
              notes_matches[noteKey] = {};
            }

            notes_matches[noteKey][notes_to_keywords[noteKey][0]] = 1;
            ketword_matches[notes_to_keywords[noteKey][0]] = key;

          }
        }
          if (placeData.geometry && placeData.geometry.location && placeValid && keyword_matchflag) {

            let type = 'other'; // Default type if none of the conditions are met

            if (placeData.types.includes('restaurant')) {
              type = 'restaurant';
            } else if (placeData.types.includes('museum')) {
              type = 'museum';
            } else if (placeData.types.includes('park')) {
              type = 'park';
            } else if (placeData.types.includes('natural_feature')) {
              type = 'natural_feature';
            } else if (placeData.types.includes('place_of_worship')) {
              type = 'worship';
            } else if (placeData.types.includes('church')) {
              type = 'church';
            } else if (placeData.types.includes('tourist_attraction')) {
              type = 'attraction';
            }

            extractedData[key] = {
              place_name: key,
              lat: placeData.geometry.location.lat,
              lng: placeData.geometry.location.lng,
              rating: placeData.rating || 'N/A',
              noteKeyInfo: noteKeyInfo,
              notes: placeData.note || [],
              type: type,
            };
          }
        }
    } catch (error) {
    }
  }
  return {notes_matches, extractedData} ;
}



export async function fileExists(cityMappings, selectedCity, jsonFileName) {

  const fileNameParts = jsonFileName.split('_');

  console.log('fileNameParts ' + fileNameParts + 'selectedCity' + selectedCity);
  // Iterate over the parts and call addMarkers for each
  let mappedCity='';

  for (const city_name of selectedCity) {
    // Perform any other operations with each city
    mappedCity = cityMappings[city_name] || city_name;

    for (const part of fileNameParts) {

      const n_fileName = mappedCity + ' ' + part;
      
      console.log('mappedCity ' + mappedCity + 'city_name ' +　city_name);
      const filePath = `C:/Users/Chang-YuTai/speed2go/data/Google_map/${mappedCity}/${n_fileName}.json`;
      const maxSizeBytes = 10 * 1024;

      try {
        const module_data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${mappedCity}/${n_fileName}.json`);
        const data = await module_data.default; // Assuming the default export is your JSON data

        // Check data size
        const dataSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;

        if (dataSizeInBytes > 5 * 1024) { return true;}
      } catch (err) {}

      // const response = await fetch(filePath);
      // await fs.access(filePath, fs.constants.F_OK);
      // const stats = await fs.stat(filePath);
      // require(`${filePath}`);
      // console.log('stats = '+ stats);
        // return stats.size >= maxSizeBytes;
      // } catch (error) {
      //   // Handle the error here if needed
      // }
    }
  }
  return false;
}



export const  getMarkerIcon = (place_type, color) => {
  switch (place_type) {
    case 'restaurant':
      return IconVariables.restaurantIcon;
    case 'museum':
      return IconVariables.museumIcon;
    case 'park':
      return IconVariables.parkIcon;
    case 'natural_feature':
      return IconVariables.parkIcon;
    case 'worship':
      return IconVariables.churchIcon;
    case 'church':
      return IconVariables.churchIcon;
    case 'attraction':
      return IconVariables.attractionIcon;
    default:
      return IconVariables.attraction2Icon;      
      // switch (color) {
      //   case 'red':
      //     return IconVariables.redIcon;
      //   case 'blue':
      //     return IconVariables.blueIcon;
      //   case 'glod':
      //     return IconVariables.goldIcon;
      //   case 'grey':
      //     return IconVariables.greyIcon;
      //   // Add more cases for different colors as needed
      //   default:
      //     return IconVariables.orangeIcon; // Default icon if color is not specified
      // }
  }
};