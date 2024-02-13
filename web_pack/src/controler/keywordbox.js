import React, { useState } from 'react';
import place_styles from './place_info_style'
import { View, Image, Text, TouchableOpacity, Linking  } from 'react-native';
import { MdFileDownloadDone } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import './keywordpop.css'; 

import { MdAdd } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { saveall, deselectall, add } from '../assets/loadsvg.js';
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import { RiCheckboxMultipleBlankLine, RiCheckboxMultipleLine  } from "react-icons/ri";

function keyBox(index, keyword, jumpToKeywordPlace) {
  const guideColors = ['#FF5733', '#3498DB', '#006400']; // Add more colors as needed
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const JumpToPlace = () => {
    // const placeName = keyMatches[keyword];
    jumpToKeywordPlace(keyword);
  };


  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        key={index}
        style={[
          place_styles.guideButton,
          { backgroundColor: guideColors[index % guideColors.length] },
        ]}
        onMouseEnter={handleMouseEnter} // Simulate mouse enter
        onMouseLeave={handleMouseLeave} // Simulate mouse leave
        onPress={JumpToPlace}
      >
        <Text style={place_styles.guideButtonText}>
          {keyword.substring(0, 8)}
        </Text>
      </TouchableOpacity>

        {isHovered && (
          <View style={[place_styles.keywordpopout]}>
            <Text style={{ whiteSpace: 'nowrap', fontSize: "16px" }}>{keyword}</Text>
          </View>
        )}

    </View>
  );
};


const keywordCheckBox = (notes_matches, noteKey, selectedKeywords, setSelectedKeywords, jumpToKeywordPlace) => {
  // Assuming notes_matches and noteKey are available in your component

  // State to store selected keywords
  if (typeof notes_matches[noteKey] === 'undefined') {
    // If undefined, return a placeholder or specific content
    return <></>;
  }

  // Function to handle checkbox change
  const handleCheckboxChange = (keyword) => {
    // Check if the keyword is already selected
    if (selectedKeywords.includes(keyword)) {
      // If selected, remove it
      setSelectedKeywords((prevSelected) =>
        prevSelected.filter((k) => k !== keyword)
      );
    } else {
      // If not selected, add it
      setSelectedKeywords((prevSelected) => [...prevSelected, keyword]);
    }
  };
  return (
    <div>
       <form style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'  }}>
        {notes_matches[noteKey].map((keyword, index) => (
          <div key={keyword} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <label htmlFor={keyword} style={{ marginLeft: '-5px' }}>
              </label>
              {keyBox(index, keyword, jumpToKeywordPlace)}
          </div>
        ))}
      </form>
    </div>
  );
};


const keywordBoxControlplace_styles = {
  position: 'absolute', // Ensure it's positioned relative to the nearest positioned ancestor
  zIndex: 1000000, // Set a value higher than other elements if needed
  // Other place_styles for keywordBoxControl
};

const keywordBoxControl = (guide, dynamicWidth, addToTrip, keyMatches, all_extractedData, marker, noteMatches, jumpToKeywordPlace) => {

//   console.log('noteMatches = '+ noteMatches + noteMatches[guide.noteid]);
//   console.log('guide.noteid = ' + guide.noteid);
  const allKeywords = noteMatches[guide.noteid];
  const [selectedKeywords, setSelectedKeywords] = useState(allKeywords);
  
  return (
    <div className="popout-guide-text_key">
      <div>
          <View style={[place_styles.noteBoxCard, { width: dynamicWidth + 120 }]}>
            <View style={place_styles.info}>
              <form style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={place_styles.addButton}
                  // onPress={() => addToTrip(marker)}
                >
                  <Text style={place_styles.addText} selectable={true}>{guide.keyword.substring(0, 20)}</Text>
                </TouchableOpacity>
              </form>
            </View>
          </View>

          <View style={[place_styles.noteBoxCard, { width: dynamicWidth + 120 }]}>
            <View style={place_styles.info}>

            <View style={place_styles.rowContainer}>
              <Text style={place_styles.noteBoxTitle}>
                {guide.title.substring(0, 15)}
              </Text>
            </View>
              {keywordCheckBox(noteMatches, guide.noteid, selectedKeywords, setSelectedKeywords, jumpToKeywordPlace)}
            </View>
          </View>
      </div>
    </div>
  );
};

export default keywordBoxControl;

