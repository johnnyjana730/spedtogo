import React, { useState, useEffect } from 'react';

import { NavLink } from "react-router-dom";
import logoImage from './logo.png';


import MySelect from './regionSelect/cityselector'

import VirtualizedSelectExample from './VirtualizedSelect/VirtualizedSelect.example'
import SelectStyles from './css/select_btn_style'
import './css/search.css'; 
import "./css/NavBar.css";
import "./css/controler.css";
import regionCity from './data/region_spot.js'
import { cityMappings, city_coordinate } from  './data/city_info.js';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap'; // Import Bootstrap components

import { sheets, attraction, event, beach, firework, camera, hotpot, chinesefood, hike, japfood, dessert, food, clean } from '../assets/loadsvg.js';

import {
  handleClearMarkers,
  addCityMarker
} from '../map/mapFunctions';

import { fileExists } from '../data/dataLoader'; // Adjust the path to the dataLoader.js file


import Select from 'react-select';

const RevisionSelect = (selectedCity, setselectedCity, setCenter, setZoom, city_coordinate, setAccordionStates, handleLayerAction) => {

  const isNotMobile = window.innerWidth > 1200;

  const handleChange = (selectedOption) => {
      // Update the outerselectedCity state in the parent component
      let n_selectedOption = selectedOption.label + ',';
      let selectedCities = n_selectedOption.split(',');

      let lastcity = "";
      for (const city_name of selectedCities) {
        // Perform any other operations with each city
        if (city_name.length > 0) {
          lastcity = city_name;
        }
      }

      if (lastcity.length > 0) {
        const coordinate = city_coordinate[lastcity];
        setCenter([coordinate[0], coordinate[1]]);
        setZoom(12);
      }
      setAccordionStates([]);
      setselectedMarkers([]);

      // Update the outerselectedCity state in the parent component
      setselectedCity(selectedCities);
  };

  return (
        <>
        <MySelect
          regionCity={regionCity}
          outerselectedCity={selectedCity}
          setselectedCity={setselectedCity}
          setCenter={setCenter}
          setZoom={setZoom}
          city_coordinate={city_coordinate}
          handleLayerAction={handleLayerAction}
          setAccordionStates={setAccordionStates}
        />
        </>
    );
}

const Nav_Icon = (props) => {
  return (
    <div className="column-container">
      <div className="centered-content">
        <li className="nav-item">
          <NavLink
            exact
            to={props.toname}
            activeClassName="active"
            className="nav-links"
            onClick={props.handleClick}
          >
            <div className="icon_nav-container">
              <img src={props.icon} className="icon_nav"/>
              <div className="text-left">{props.text}</div>
            </div>
          </NavLink>
        </li>
      </div>
    </div>
  );
};

function NavBar_v1(props) {
  const [click, setClick] = useState(false);

  const isNotMobile = window.innerWidth > 900;

  const [selectedOption, setSelectedOption] = useState(null);

  const buttons = [
    { text: '景點', icon: attraction, category: '景點' },
    { text: '拍照/打卡', icon: camera, category: '拍照_打卡' },
    { text: '活動', icon: event, category: '活動1月_2月活動' },
    { text: 'malibu', icon: beach, category: 'malibu' },
    { text: '燈光秀', icon: firework, category: '燈光秀' },
    { text: '登山', icon: hike, category: '登山_hiking' },
    { text: '美食', icon: food, category: '美食_西班牙菜_法餐_brunch_牛排' },
    { text: '火鍋', icon: hotpot, category: '火鍋' },
    { text: '中餐', icon: chinesefood, category: '中餐' },
    { text: '日料', icon: japfood, category: '日本料理' },
    { text: '甜點', icon: dessert, category: '甜點_飲料' },
  ];

  const uniCategories = buttons.flatMap(button => button.category.split('_'));

  const [fileExistData, setFileExists] = useState({});

  useEffect(() => {
    const checkFiles = async () => {
      const fileExistence = {};
      for (const button of buttons) {
        fileExistence[button.category] = await fileExists(cityMappings, props.selectedCity, button.category);
      }

      setFileExists(fileExistence);
    };

    checkFiles();
  }, [props.selectedCity]);

  return (
    <>
     <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo responsive-image">
            <img src={logoImage} alt="City Icon" className="city-icon" style={{ width: '230px', height: '50px', top: '44px', left: '5px', position: 'absolute', zIndex: 1 }} />
          </NavLink>
          {RevisionSelect(props.selectedCity, props.setselectedCity, props.setCenter, props.setZoom, city_coordinate, props.setAccordionStates, props.handleLayerAction)}

            <ul className="nav-menu">
              <div className="nav-menu-div">
              {isNotMobile && <Nav_Icon text=" 行程 " icon={sheets} handleClick={props.openIndependentWindow} />}
              {buttons.map((button) => (
                fileExistData[button.category] && (
                  <Nav_Icon key={button.text} text={button.text} icon={button.icon}
                   handleClick={() => addCityMarker(props.selectedCity, cityMappings, button.category, uniCategories, props.setMarkers, props.setAccordionStates, props.setnoteMatches, props.setkeyMatches, props.setall_extractedData)} /> )
              ))}
               {/* <Nav_Icon text=" 清空標記 " icon={clean} handleClick={() => handleClearMarkers(props.setMarkers, props.setAccordionStates)} /> */}
              {(isNotMobile && <Nav_Icon text=" 清空標記 " icon={clean} handleClick={() => handleClearMarkers(props.handleLayerAction, props.setAccordionStates)} />)}
              </div>
             </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar_v1;