import React, { useState } from 'react';
import styles from './place_info_style'
import { View, Image, Text, TouchableOpacity, Linking  } from 'react-native';
import { MdFileDownloadDone } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import './popout.css'; 

import { MdAdd } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { saveall, deselectall, add } from '../assets/loadsvg.js';
import { MdOutlineLibraryAddCheck } from "react-icons/md";
import { RiCheckboxMultipleBlankLine, RiCheckboxMultipleLine  } from "react-icons/ri";

function keyBox(index, keyword, jumpToKeywordPlace) {
  const guideColors = ['#FF5733', '#3498DB', '#006400']; // Add more colors as needed

  const isNotMobile = window.innerWidth > 800;
  const keyword_size = isNotMobile ? 7 : 4;
  const marginLeft = isNotMobile ?  '0px' : '-4px';
  const marginRight = isNotMobile ? '0px' : '-4px';

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
          styles.guideButton,
          { backgroundColor: guideColors[index % guideColors.length],},
        ]}
        onMouseEnter={handleMouseEnter} // Simulate mouse enter
        onMouseLeave={handleMouseLeave} // Simulate mouse leave
        onPress={JumpToPlace}
      >
        <Text style={{ ...styles.guideButtonTextKBox, marginLeft: marginLeft, marginRight: marginRight }}>
          {keyword.substring(0, keyword_size)}
        </Text>
      </TouchableOpacity>

        {isHovered && (
          <View style={[styles.keywordpopout]}>
            <Text style={{ whiteSpace: 'nowrap' }}>{keyword}</Text>
          </View>
        )}

    </View>
  );
};


const keywordCheckBox = (notes_matches, noteKey, selectedKeywords, setSelectedKeywords, jumpToKeywordPlace) => {
  // Assuming notes_matches and noteKey are available in your component
  const isNotMobile = window.innerWidth > 800;

  const CBox_div_marginLeft = isNotMobile ? '0px' : '-6px';
  const CBox_label_marginLeft = isNotMobile ? '-5px' : '-8px';

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
          <div key={keyword} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: CBox_div_marginLeft }}>
              <input
                  type="checkbox"
                  id={keyword}
                  checked={selectedKeywords.includes(keyword)}
                  onChange={() => handleCheckboxChange(keyword)}
              />
              <label htmlFor={keyword} style={{ marginLeft: CBox_label_marginLeft }}>
              </label>
              {keyBox(index, keyword, jumpToKeywordPlace)}
          </div>
        ))}
      </form>
    </div>
  );
};



const IconNavContainer = (noteMatches, title, noteid, markerInfo, selectedKeywords, setSelectedKeywords, handleLayerAction, addToTrip, keyMatches, all_extractedData) => {

  const [isSaveAll, setIsSaveAll] = useState(false);

  const isNotMobile = window.innerWidth > 800;
  const icon_fontSize = isNotMobile ? "22px" : "14px";
  const icon_border = isNotMobile ? '2px solid black'  : '1px solid black' ;
  const icon_margin_left = isNotMobile ? '7px'  : '2px' ;
  const icon_top = isNotMobile ? '-5px'  : '-3px' ;
  const icon_left = isNotMobile ? '5px'  : '3px' ;

  const icon_style = { color: 'black', width: icon_fontSize, 
                      height: icon_fontSize, border:  icon_border, marginLeft: icon_margin_left,
                      top: icon_top, left: icon_left};


  const handleSaveAllClick = () => {
    // Add logic to handle saving all or deselecting all

    // Toggle the state
    setIsSaveAll((prevIsSaveAll) => !prevIsSaveAll);

     if (!isSaveAll) {
        setSelectedKeywords([]);
      } else {
        setSelectedKeywords(Object.keys(noteMatches[noteid]));
      }
  };

  const handleAddClick = () => {
    handleLayerAction('update_cur_layer_info', title.substring(0, 15));

    selectedKeywords.forEach((keyword) => {

      // # filter note id and place it in the beginning of notes and notekeyinfo list

      // Assuming keyMatches is a function that takes a keyword and returns key_name

      const placeName = keyMatches[keyword];

      // Assuming all_extractedData is an object with keys corresponding to key_names
      const placeInfo = all_extractedData[placeName];

      placeInfo.noteKeyInfo[noteid] = markerInfo;

      const filteredNotes = placeInfo.notes.filter(note => note !== noteid);

      const newMarker = {
        id: 0,
        place_type: placeInfo.type,
        name: placeName,
        noteKeyInfo: placeInfo.noteKeyInfo,
        notes: [noteid, ...filteredNotes],
        description: 'description',
        rating: placeInfo.rating,
        relatedGuide: 'relatedGuide',
        position: [placeInfo.lat, placeInfo.lng],
      };
      // Assuming addToTrip is a function that takes a marker and adds it to a trip
      addToTrip(newMarker);
    });
  };

  return (
    <div  style={{ display: 'flex', flexDirection: 'row' }}>

      <TouchableOpacity
        style={styles.addButton_keyword}
        onPress={handleSaveAllClick} // Use onPress for touchable components
      >
      {isSaveAll ? (
        <RiCheckboxMultipleLine className="icon_nav_keyword_b1" style={icon_style} />
      ) : (
        <RiCheckboxMultipleBlankLine className="icon_nav_keyword_b1" style={icon_style} />
      )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton_keyword}
        onPress={handleAddClick}
      >
      <MdOutlineLibraryAdd className="icon_nav_keyword_b1" style={icon_style} />
      </TouchableOpacity>
    </div>
  );
};


const keywordBox = (guide, dynamicWidth, addToTrip, handleLayerAction, keyMatches, all_extractedData, marker, jumpToKeywordPlace, noteMatches) => {

  const allKeywords = noteMatches[guide.noteid];
  const [selectedKeywords, setSelectedKeywords] = useState(allKeywords);
  

  const markerInfo = marker.noteKeyInfo[guide.noteid];

  const isNotMobile = window.innerWidth > 800;
  const icon_border = isNotMobile ? '2px solid #000'  : '1px solid #000' ;

  const mobileKBox_size = Math.min(300, 300 + (guide.title.length - 10) * 3);

  const dynamicWidthKBox = isNotMobile ? dynamicWidth : mobileKBox_size;

  const keywordBox_style = { border:  icon_border };

  return (
    <div className="popout-guide-text" style={keywordBox_style}>
      <div>
        <View style={[styles.noteBoxCard, { maxWidth: dynamicWidthKBox }]}>
          <View style={styles.info}>
            <form style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <TouchableOpacity
                style={styles.addButton}
                // onPress={() => addToTrip(marker)}
              >
                <Text style={styles.addText} selectable={true}>{guide.keyword.substring(0, 20)}</Text>
              </TouchableOpacity>
            </form>
          </View>
        </View>

        <View style={[styles.noteBoxCard, { maxWidth: dynamicWidthKBox }]}>
          <View style={styles.info}>

          <View style={styles.rowContainer}>
            <Text style={styles.noteBoxTitle}>
              {guide.title.substring(0, 15)}
            </Text>
            {IconNavContainer(noteMatches, guide.title, guide.noteid, markerInfo, selectedKeywords, setSelectedKeywords, handleLayerAction, addToTrip, keyMatches, all_extractedData)}
          </View>
            {keywordCheckBox(noteMatches, guide.noteid, selectedKeywords, setSelectedKeywords, jumpToKeywordPlace)}
          </View>
        </View>
      </div>
    </div>
  );
};

export default keywordBox;

  {/* <div> */}
  {/*   <ul> */}
  {/*     {selectedKeywords.map((keyword) => ( */}
  {/*       <li key={keyword}>{keyword}</li> */}
  {/*     ))} */}
  {/*   </ul> */}
  {/* </div> */}


// 
// function getKeywords(notes_matches, noteKey) {
//     const nodes = [];
//     console.log('notes_matches:', notes_matches);
//     console.log('noteKey:', noteKey);
// 
//     for (const keyword in notes_matches[noteKey]) {
//         nodes.push({value: keyword, label: 'tmp'});
//     }
// 
//     const [checked, setChecked] = useState([]);
//     const [expanded, setExpanded] = useState([]);
// 
//     const inlineStyle = {
//       display: 'inline', // or 'inline'
//     };
// 
//     return (
//       <CheckboxTree
//         style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
//         nodes={nodes}
//         checked={checked}
//         expanded={expanded}
//         onCheck={(checked) => setChecked(checked)}
//         onExpand={(expanded) => setExpanded(expanded)}
//       />
//     );
// }
// 
// 
//                 <div className="popout-guide-text">
// 
//                   <View style={[styles.card,  { width: dynamicWidth }]}>
//                   <View style={[styles.noteBoxCard, {  width: dynamicWidth }]}>
//                       <View style={styles.info}>
//                       <form style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'  }}>
//                           <TouchableOpacity
//                             style={styles.addButton}
//                             onPress={() => addToTrip(marker)} Call addToTrip when the button is pressed
//                           >
//                             <Text style={styles.addText}>{guide.keyword.substring(0, 30)}</Text>
//                           </TouchableOpacity>
//                         </form>
//                         </View>
//                     </View>
// 
// 
//                   <View style={[styles.noteBoxCard, {  width: dynamicWidth }]}>
//                       <View style={styles.info}>
//                         <Text style={styles.noteBoxTitle}>{guide.title.substring(0, 15)}
//                           <TouchableOpacity
//                             style={styles.addButton}
//                             onPress={() => addToTrip(marker)} Call addToTrip when the button is pressed
//                           >
//                             <Text style={styles.addText}>Add</Text>
//                           </TouchableOpacity>
//                         </Text>{keywordCheckBox(noteMatches, guide.noteid)}
//                         </View>
//                   </View>
// 
//                 </div>