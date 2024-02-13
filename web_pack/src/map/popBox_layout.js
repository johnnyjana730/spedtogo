import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Linking  } from 'react-native';

import { Rating, RoundedStar } from '@smastrom/react-rating'
import styles from './place_info_style'
import '@smastrom/react-rating/style.css'
import './popout.css'; 
import keywordBox from './keywords_checkbox';
let idCounter = 0;


const RestaurantCard = ({marker, noteMatches, keyMatches, all_extractedData, handleLayerAction, jumpToKeywordPlace, isAccordionOpen, toggleAccordion }) => {

  const isNotMobile = window.innerWidth > 800;

  const photo =
    'https://media.cntraveler.com/photos/57d87670fd86274a1db91acd/1:1/w_1536,h_1536,c_limit/most-beautiful-paris-pont-alexandre-iii-GettyImages-574883771.jpg';

  const minimumWidth = isNotMobile ? 500 : 200;

  const dynamicWidth = Math.min(minimumWidth, 300 + (marker.name.length - 10) * 3);


  const myStyles = {
    itemShapes: RoundedStar,
    activeFillColor: '#ffb700',
    inactiveFillColor: '#fbf1a9'
  }

  const accordionContent = (
    <View style={[{marginTop: -5 }]}>
      <View style={styles.info}>
      <Text style={{ fontSize: 16, fontFamily: 'Arial', marginTop: -5 }}>
        1. 人均: xx, 停車: xx, 預約: xx
      </Text>
      <Text style={{ fontSize: 16, fontFamily: 'Arial', marginTop: -5 }}>
        2. 推薦路線
      </Text>
      </View>
    </View>

  );

  // Define an array of related guides with their corresponding colors
  const guideColors = ['#FF5733', '#3498DB', '#006400']; // Add more colors as needed
  const relatedGuides = [];

  const addToTrip = (marker) => {
    handleLayerAction('addMarktoLayer', marker);
  };

  Object.keys(marker.noteKeyInfo).forEach((noteKey, index) => {
    const markerInfo = marker.noteKeyInfo[noteKey];
    relatedGuides.push({
      text: `Link ${index + 1}`,
      keyword: markerInfo['matchKeyword'],
      title: markerInfo['title'],
      color: guideColors[index % guideColors.length],
      noteid: noteKey,
      url: "https://www.xiaohongshu.com/explore/" + noteKey
    });
  });


  return (
     <View>
      <View style={[styles.card, { width: dynamicWidth }]}>
        { isNotMobile && (<Image source={{ uri: photo }} style={styles.photo} />)}
        <View style={styles.info}>
          <Text style={styles.name}>{marker.name}</Text>
          { isNotMobile && (<View style={styles.rating}>
            <Rating
              style={{ maxWidth: 100}}
              itemStyles={myStyles}
              value={marker.rating}
              readOnly
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToTrip(marker)} // Call addToTrip when the button is pressed
            >
              <Text style={styles.addText}>Add to Trip</Text>
            </TouchableOpacity>
          </View>)}
          </View>
      </View>
    
      <View style={[styles.card, { width: dynamicWidth, flexDirection: "column"}]}>
        <View style={styles.actions, { zIndex: 3000 }}>
             <View style={[styles.guideButtons]}>
             { isNotMobile && (<Text style={[styles.ratingText]}>相關攻略:</Text> )}
              {relatedGuides.map((guide, index) => (
                <div className="icon_nav-container-guide">
                  <TouchableOpacity
                    key={index}
                    style={[styles.guideButton, { backgroundColor: guide.color}]}
                    onPress={() => Linking.openURL(guide.url)}
                  >
                    <Text style={styles.guideButtonText}>{guide.text}</Text>
                  </TouchableOpacity>
                    {keywordBox(guide, dynamicWidth, addToTrip, handleLayerAction, keyMatches, all_extractedData, marker, jumpToKeywordPlace, noteMatches)}
                </div>
              ))}
          </View>
        </View>
      </View>
    </View>

  );
};


export default RestaurantCard;



        {/* todo note 攻略 extract */}
{/*          <View style={[styles.guideButtons]}> */}
{/*          <Text style={[styles.ratingText]}>推薦:</Text> */}
{/*           {relatedGuides.map((guide, index) => ( */}
{/*             <TouchableOpacity */}
{/*               key={index} */}
{/*               style={[styles.guideButton, { backgroundColor: guide.color }]} */}
{/*             > */}
{/*               <Text style={styles.guideButtonText}>{guide.text}</Text> */}
{/*             </TouchableOpacity> */}
{/*           ))} */}
{/*  */}
{/*  */}
{/*         </View> */}
{/*           <View style={[styles.guideButtons]}> */}
{/*           <TouchableOpacity onPress={toggleAccordion} style={[styles.guideButton, { backgroundColor:'black'}]}> */}
{/*             <Text style={styles.guideButtonText}>More details</Text> */}
{/*           </TouchableOpacity> */}
{/*           </View> */}
{/*           {isAccordionOpen && accordionContent} */}