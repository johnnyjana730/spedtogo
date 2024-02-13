import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Iconfont from 'react-native-vector-icons/FontAwesome5';

import "./cityselector.css";

import { FaBeer } from 'react-icons/fa';

import { FaSearch } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosCheckmark } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const Icon = ({ name, size = 18}) => {
    // flatten the styles

    let iconComponent
    // the colour in the url on this site has to be a hex w/o hash

    const Search = (
        <FaSearch />
    )
    const Down = (
        <FaCaretDown />
    )
    const Up = (
        <FaCaretUp/>
    )
    const Close = (
        <IoIosCloseCircleOutline />
    )

    const Check = (
        <IoCheckmark />
    )
    const Cancel = (
        <MdOutlineCancel />
    )

    switch (name) {
      case 'search':
        iconComponent = Search
        break
      case 'keyboard-arrow-up':
        iconComponent = Up
        break
      case 'keyboard-arrow-down':
        iconComponent = Down
        break
      case 'close':
        iconComponent = Close
        break
      case 'check':
        iconComponent = Check
        break
      case 'cancel':
        iconComponent = Cancel
        break
      default:
        iconComponent = null
        break
    }
    return <View >{iconComponent}</View>
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    };
  }

  render() {

    const { regionCity, setselectedCity, setCenter, setZoom, city_coordinate, handleLayerAction, setAccordionStates } = this.props

    const cityIdToName = {};
    regionCity.forEach(region => {
      region.children.forEach(city => {
        cityIdToName[city.name] = city.name;
      });
    });


    const onSelectedItemsChange = selectedItems => {
      if (selectedItems.length > 3) {
        // Remove the first item
        selectedItems.shift();
      }

      this.setState({ selectedItems });

      // Update the outerselectedCity state in the parent component
      let n_selectedOption = selectedItems + ',';
      let selectedCities = n_selectedOption.split(',');

      let n_selectedCities = [];
      let lastcity = "";
      for (const city_name of selectedCities) {
        // Perform any other operations with each city
        if (city_name && city_name.length > 0 && city_name in cityIdToName) {
          n_selectedCities.push(city_name);
          lastcity = city_name;
        }
      }

      if (lastcity && lastcity.length > 0 ) {
        const coordinate = city_coordinate[lastcity];
        setCenter([coordinate[0], coordinate[1]]);
        setZoom(12);
        this.sectionedMultiSelect._toggleSelector();
      }
      setAccordionStates([]);
      handleLayerAction('emptymarker');

      // Update the outerselectedCity state in the parent component
      setselectedCity(n_selectedCities); // Fixed: Pass the correct array to setselectedCity
    };


    let style_width = '400px';
    let style_transform = "scale(1.0)";
    let style_left = '260px';
    let fontSize = '36px';
    let top = '58px';

    if (window.innerWidth < 1600){
      style_width = '300px';
      style_left = '260px';
    }

    if (window.innerWidth <= 1400){
      style_transform = 'scale(1.0)';
      style_left = '10px';
    }

    if (window.innerWidth < 1200){
      style_transform = 'scale(0.9)';
      top = '24px';
    }

    if (window.innerWidth < 900){
      style_transform = 'scale(0.85)';
      top='24px';
    }

    if (window.innerWidth < 800){
      top='18px';
    }


    if (window.innerWidth < 500){
      style_transform = 'scale(0.72)';
      top='28px';
    }

    if (window.innerWidth < 450){
      style_transform = 'scale(0.65)';
      top='28px';
    }

    const renderSelectText = () => {
      return "";
    };

    return (
      <View style={{
        position: "absolute",
        left: style_left,
        top: top,
      }}>
        <SectionedMultiSelect
          items={regionCity}
          IconRenderer={Icon}
          uniqueKey="name"
          subKey="children"
          selectText=""
          renderSelectText={renderSelectText}
          ref={(ref) => (this.sectionedMultiSelect = ref)}
          showDropDowns={true}
          showRemoveAll={true}
          searchPlaceholderText={"Search Cities"}
          showChips={false}
          hideConfirm={false}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          styles={{
          // Other styles...
          item: {
            color: 'white', // Set the color for subItem
            // Add more styles for subItem as needed
          },
          itemText:{
            display: "none"
          },
          subItem: {
            color: 'green', // Set the color for subItem
            flex: "0 -1 100%",
            whiteSpace: 'nowrap',
            paddingBottom: '2px',
            paddingRight: '10px'
            // Add more styles for subItem as needed
          },
          subSeparator: {
            display: "none"
          },
          itemText:{
            fontFamily: 'Arial, sans-serif',
            fontSize: 14
          },
          subItemText: {
            // Style for the item icon
            fontFamily: 'Arial, sans-serif',
            paddingLeft: "5px", // Add padding as needed
            paddingRight: "5px", // Add padding as needed
            fontSize: 14
          },
          center:{
            paddingTop: "10px",
            paddingLeft: "10px", // Add padding as needed
            paddingRight: "10px", // Add padding as needed
          },
          searchBar:{
            maxWidth: "200px",
            paddingTop: "10px",
            paddingLeft: "10px", // Add padding as needed
            paddingRight: "20px", // Add padding as needed
          },
          searchTextInput:{
            paddingLeft: "10px",
            maxWidth: "200px",
            fontFamily: 'Arial, sans-serif',
          },
          selectToggle: {
            fontSize: fontSize,
            color: 'white',
            top: "-8px",
            paddingBottom: "15px", // Add padding as needed
            paddingTop: "-10px", // Add padding as needed
            paddingLeft: "1.5px", // Add padding as needed
            paddingRight: "1.5px", // Add padding as needed
            borderWidth: '0.5px', // Border width
            borderColor: 'white', // Border color
            borderRadius: 5, // Border radius
            width: "2.5rem",
            height: "2.5rem",
            transform: style_transform,
          },
          modalWrapper: {
            left: style_left,
            maxHeight: "80%", // Set your desired max height here
            maxWidth: "400px",
            backgroundColor: "transparent",
          },
          scrollView: {
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Hide horizontal scrolling  
          },
          confirmText:{
            top: "20px",
            fontFamily: 'Arial, sans-serif',
            color: "black",
            // backgroundColor: "black",
            padding: '5px',
            borderWidth: '2px', // Border width
            borderColor: 'black', // Border color
            borderRadius: 5, // Border radius
            fontSize: 14
          },
          button:{
            backgroundColor: "transparent"
          }
          }}

        />
      </View>
    );
  }
}