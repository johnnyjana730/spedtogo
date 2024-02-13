
import * as IconVariables from '../map/mapVariables';
const fs = require('fs').promises;

export async function loadPlacesData(city_name, fileName) {
  try {
    // const data = await import(`./${fileName}.json`);
    const n_fileName = city_name + ' ' + fileName;
    const data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`);

    // Extract the desired information
    const extractedData = {};

    for (const key in data) {
      const placeData = data[key];
      const placeValid = placeData.valid;
      const notes_to_keywords = placeData.notes_to_keywords;

      if (!placeValid) {continue}
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

      const filteredNoteIds = placeData.note.filter(noteId => noteKeyInfo.hasOwnProperty(noteId));


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
          notes: filteredNoteIds || [],
          type: type,
          top_ranked: placeData.top_ranked || false,
        };
      }
    }
    return { extractedData};
  } catch (error) {
    throw new Error(`Error loading ${fileName}.json: ${error.message}`);
  }
}


export async function readNoteMatch(selectedCity, cityMappings, fileNames) {
  
  const notes_matches  = {};
  const ketword_matches = {};
  const extractedData = {};

  for (const city_name_bf of selectedCity) {
    const city_name = cityMappings[city_name_bf] || city_name_bf;

    let n_fileName = city_name + '_info'; 

    try{
        const data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`);
        const n_notes_matches = data[0];
        const n_ketword_matches = data[1];
        const n_extractedData = data[2];

        // Update notes_matches
        for (const key in n_notes_matches) {
          notes_matches[key] = n_notes_matches[key];
        }

        // Update ketword_matches
        for (const key in n_ketword_matches) {
          ketword_matches[key] = n_ketword_matches[key];
        }

        // Update extractedData
        for (const key in n_extractedData) {
          extractedData[key] = n_extractedData[key];
        }
    } 
    catch (error) {
        throw new Error(`Error loading ${fileName}.json: ${error.message}`);
    }
  }
  return {notes_matches, extractedData, ketword_matches} ;
}


// 
// 
//   for (const city_name_bf of selectedCity) {
//     const city_name = cityMappings[city_name_bf] || city_name_bf;
// 
//     for (const fileName of fileNames) {
// 
//         const n_fileName = city_name + ' ' + fileName;
// 
//         if (city_name === null || city_name === undefined) {
//             console.log('city_name is null or undefined');
//             continue;
//         }
// 
//         try {
//           
// 
//           const data = await import(`C:/Users/Chang-YuTai/speed2go/data/Google_map/${city_name}/${n_fileName}.json`);
// 
//           for (const key in data) {
//             const placeData = data[key];
//             const placeValid = placeData.valid;
//             const notes_to_keywords = placeData.notes_to_keywords;
// 
//             if (!placeValid) {continue}
//       
//             const noteKeyInfo = {};
// 
//             let keyword_matchflag = false;
//             for (const noteKey in notes_to_keywords) {
//               const noteValue = notes_to_keywords[noteKey][1];
// 
//               // Check if noteValue is not false
//               if (noteValue !== false) {
// 
//                 keyword_matchflag = true;
// 
//                 // if skip placeData.note is not consistent with noteKeyInfo
//                 noteKeyInfo[noteKey] = {
//                   matchKeyword: notes_to_keywords[noteKey][0],
//                   title: notes_to_keywords[noteKey][2],
//                 };
// 
//                 if (!notes_matches[noteKey]) {
//                   notes_matches[noteKey] = {};
//                 }
// 
// 
//                 // console.log('notes_to_keywords[noteKey][-1] = ' + notes_to_keywords[noteKey][-1]);
//                 notes_matches[noteKey][notes_to_keywords[noteKey][0]] = notes_to_keywords[noteKey][3];
//                 ketword_matches[notes_to_keywords[noteKey][0]] = key;
// 
//               }
//             }
//             
// 
//             const filteredNoteIds = placeData.note.filter(noteId => noteKeyInfo.hasOwnProperty(noteId));
// 
// 
//             if (placeData.geometry && placeData.geometry.location && placeValid && keyword_matchflag) {
// 
//                 let type = 'other'; // Default type if none of the conditions are met
// 
//                 if (placeData.types.includes('restaurant')) {
//                   type = 'restaurant';
//                 } else if (placeData.types.includes('museum')) {
//                   type = 'museum';
//                 } else if (placeData.types.includes('park')) {
//                   type = 'park';
//                 } else if (placeData.types.includes('natural_feature')) {
//                   type = 'natural_feature';
//                 } else if (placeData.types.includes('place_of_worship')) {
//                   type = 'worship';
//                 } else if (placeData.types.includes('church')) {
//                   type = 'church';
//                 } else if (placeData.types.includes('tourist_attraction')) {
//                   type = 'attraction';
//                 }
// 
//                 extractedData[key] = {
//                   place_name: key,
//                   lat: placeData.geometry.location.lat,
//                   lng: placeData.geometry.location.lng,
//                   rating: placeData.rating || 'N/A',
//                   noteKeyInfo: noteKeyInfo,
//                   notes: filteredNoteIds || [],
//                   type: type,
//                   top_ranked: placeData.top_ranked || false,
//                 };
//               }
//             }
//         } catch (error) { }
//      }
//   }
// 
//   for (const noteKey in notes_matches) {
//     // Check if the property is directly on the object and not inherited
//       // Get the object associated with the current noteKey
//     const currentNoteMatches = notes_matches[noteKey];
// 
//     // Convert the object into an array of key-value pairs
//     const keyValuePairs = Object.entries(currentNoteMatches);
// 
//     // console.log('be keyValuePairs = '+ keyValuePairs);
//     // Sort the array based on the values (assuming values are numbers)
//     // keyValuePairs.sort((a, b) => a[1] - b[1]);
// 
//     // console.log('after keyValuePairs = '+ keyValuePairs);
// 
//     // Reconstruct the object from the sorted array
//     notes_matches[noteKey] = Object.fromEntries(keyValuePairs);
//   
//   }}
// 
export async function fileExists(cityMappings, selectedCity, jsonFileName) {

  const fileNameParts = jsonFileName.split('_');

  // Iterate over the parts and call addMarkers for each
  let mappedCity='';

  for (const city_name of selectedCity) {
    // Perform any other operations with each city
    mappedCity = cityMappings[city_name] || city_name;

    for (const part of fileNameParts) {

      const n_fileName = mappedCity + ' ' + part;
      
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

export const getMarkerIcon = (place_type, color, usePoP) => {
  // const selectedIcon = usePoP ? IconVariables.attraction2IconPoP : IconVariables.attraction2Icon;

  switch (place_type) {
    case 'restaurant':
      return usePoP ? IconVariables.restaurantIconPoP : IconVariables.restaurantIcon;
    case 'museum':
      return usePoP ? IconVariables.museumIconPoP : IconVariables.museumIcon;
    case 'park':
    case 'natural_feature':
      return usePoP ? IconVariables.parkIconPoP : IconVariables.parkIcon;
    case 'worship':
    case 'church':
      return usePoP ? IconVariables.churchIconPoP : IconVariables.churchIcon;
    case 'attraction':
      return usePoP ? IconVariables.attractionIconPoP : IconVariables.attractionIcon;
    default:
      return usePoP ? IconVariables.attraction2IconPoP : IconVariables.attraction2Icon;
  }
};

// 
// export const  getMarkerIcon = (place_type, color) => {
//   switch (place_type) {
//     case 'restaurant':
//       return IconVariables.restaurantIcon;
//     case 'museum':
//       return IconVariables.museumIcon;
//     case 'park':
//       return IconVariables.parkIcon;
//     case 'natural_feature':
//       return IconVariables.parkIcon;
//     case 'worship':
//       return IconVariables.churchIcon;
//     case 'church':
//       return IconVariables.churchIcon;
//     case 'attraction':
//       return IconVariables.attractionIcon;
//     default:
//       return IconVariables.attraction2Icon;
//   }
// };
// 
// 
// 
// export const  getMarkerIconPoP = (place_type, color) => {
//   switch (place_type) {
//     case 'restaurant':
//       return IconVariables.restaurantIconPoP;
//     case 'museum':
//       return IconVariables.museumIconPoP;
//     case 'park':
//       return IconVariables.parkIconPoP;
//     case 'natural_feature':
//       return IconVariables.parkIconPoP;
//     case 'worship':
//       return IconVariables.churchIconPoP;
//     case 'church':
//       return IconVariables.churchIconPoP;
//     case 'attraction':
//       return IconVariables.attractionIconPoP;
//     default:
//       return IconVariables.attraction2IconPoP;      
//   }
// };


export const  getMarkerIconHL = (place_type, color) => {
  switch (place_type) {
    case 'restaurant':
      return IconVariables.restaurantIconHL;
    case 'museum':
      return IconVariables.museumIconHL;
    case 'park':
      return IconVariables.parkIconHL;
    case 'natural_feature':
      return IconVariables.parkIconHL;
    case 'worship':
      return IconVariables.churchIconHL;
    case 'church':
      return IconVariables.churchIconHL;
    case 'attraction':
      return IconVariables.attractionIconHL;
    default:
      return IconVariables.attraction2IconHL;      
  }
};