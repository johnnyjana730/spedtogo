import React, { useRef, useState   } from 'react';
import { View, Text, TouchableOpacity, Linking  } from 'react-native';
import './css/controler.css';
import { RiDeleteBack2Line } from 'react-icons/ri';
import 'react-awesome-button/dist/styles.css';
import { BiMap } from 'react-icons/bi';
import keywordBoxControl from './keywordbox';
import styles from '../map/place_info_style'

import place_styles from './place_info_style'

const MainComponent = ({ tag, handleButtonClick, handleClickDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="row" style={{ backgroundColor: 'transparent',  zIndex: 99 }}>
      <div className="text-container" onClick={() => handleButtonClick(tag)}

      style={{
        backgroundColor: hovered ? 'gray' : 'transparent',
        transition: 'background-color 0.3s',
      }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}

      >
        <BiMap style={{ fontSize: '24px', marginBottom: '-3px'}}/>
        <span style={{  fontSize: '20px', marginLeft: '10px' , fontFamily: 'Roboto, Arial, sans-serif' }}>{tag.name}</span>
      </div>
      <button className="delete" onClick={() => handleClickDelete(tag)}>
        <RiDeleteBack2Line />
      </button>
    </div>
  );
};

function getZIndex(index) {
  // You can adjust the logic here to set the z-index as needed
  // For example, you can use a constant value or a formula based on the index
  return index * 10; // Adjust as needed
}

const GuideSection = ({ tag, noteMatches, keyMatches, all_extractedData, jumpToKeywordPlace }) => {

  const guideColors = ['#FF5733', '#3498DB', '#006400']; // Add more colors as needed

  const dynamicWidth = 300;

  const addToTrip = (marker) => {
    let markerExists = false;

    // Check if there is already a marker with the same name
    selectedMarkers.forEach((existingMarker) => {
      if (existingMarker.name === marker.name) {
        // A marker with the same name already exists
        markerExists = true;
      }
    });

    if (markerExists) {
      // Handle the case when a marker with the same name already exists
      console.log('A marker with the same name already exists.');
      return; // Do not add the marker
    }

    idCounter = idCounter + 1;
    const n_maker = { ...marker, id: idCounter };
    setselectedMarkers((prevMarkers) => [...prevMarkers, n_maker]);
  };


  const getrelatedGuides = (notes) => {
    const relatedGuides = [];
    notes.forEach((note, index) => {
      const markerInfo = tag.noteKeyInfo[note];
      // TODO check why note key is missing in noteKeyInfo dict
      // Skip if markerInfo is 'none'
      if (markerInfo && markerInfo !== 'none') {
        relatedGuides.push({
          text: `Link ${index + 1}`,
          keyword: markerInfo['matchKeyword'],
          title: markerInfo['title'],
          color: guideColors[index % guideColors.length],
          noteid: note,
          url: "https://www.xiaohongshu.com/explore/" + note
        });
      }
    });
    return relatedGuides;
  };

  return (
    <div style={{ marginBottom: '-5px' }}>
        <View style={place_styles.actions}>
             <View style={[place_styles.guideButtons]}>
             <Text style={[place_styles.ratingText]}>攻略:</Text>
              {/* {getrelatedGuides(tag.notes).map((guide, index) => ( */}
              {/*   <TouchableOpacity */}
              {/*     key={index} */}
              {/*     style={[place_styles.guideButton, { backgroundColor: guide.color }]} */}
              {/*     onPress={() => Linking.openURL(guide.url)} */}
              {/*   > */}
              {/*     <Text style={place_styles.guideButtonText}>{guide.text}</Text> */}
              {/*   </TouchableOpacity> */}
              {/* ))} */}

              {getrelatedGuides(tag.notes).slice(0, 5).map((guide, index) => (
                <div className="icon_nav-container-guide_key">
                      <TouchableOpacity
                        key={index}
                        style={[styles.guideButton, { backgroundColor: guide.color}]}
                        onPress={() => Linking.openURL(guide.url)}

                      >
                        <Text style={place_styles.guideButtonText}>{guide.text}</Text>
                    </TouchableOpacity>
                    {keywordBoxControl(guide, dynamicWidth, addToTrip, keyMatches, all_extractedData, guide, noteMatches, jumpToKeywordPlace)}
                </div>
              ))}
          </View>

        </View> 
        {/* <View style={[place_styles.guideButtons]}> */}
        {/* <Text style={[place_styles.ratingText]}>推薦:</Text> */}
        {/* {getrelatedGuides(tag.notes).map((guide, index) => ( */}
        {/*   <TouchableOpacity */}
        {/*     key={index} */}
        {/*     style={[place_styles.guideButton, { backgroundColor: guide.color }]} */}
        {/*   > */}
        {/*     <Text style={place_styles.guideButtonText}>{guide.text}</Text> */}
        {/*   </TouchableOpacity> */}
        {/* ))} */}
        {/* </View> */}
    </div>
  );
};

export { MainComponent, GuideSection }; // Named export