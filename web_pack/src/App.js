/* global __DEV__ */

// src/App.js
import React, { useState } from "react";
import Select from 'react-select';

import './App.css';
import NavBar_v1 from "./navbar/NavBar";
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import Map from './Map';
import { useMapState } from './map/mapFunctions';

let idCounter = 0;

function App() {

  const {center, loading, setCenter, zoom, setZoom} = useMapState();

  const [markers, setMarkers] = useState([]); // State to store markers
  const [noteMatches, setnoteMatches] = useState({}); // State to store markers
  const [keyMatches, setkeyMatches] = useState({}); // State to store markers
  const [all_extractedData, setall_extractedData] = useState({}); // State to store markers

  const [selected_idx, setselected_idx] = useState(0);
  const [selectedMarkers_lt, setselectedMarkers_lt] = useState([{'layer_name':"圖層1", "layer_data":[]}]); // State to store markers

  const handleLayerAction = (actionType, ...params) => {
    switch (actionType) {
      case 'readlayertitle':
        return selectedMarkers_lt[selected_idx]['layer_name'];
        break;

      case 'switch_layer':
        const switchValue = params[0];
        let newLayerIndex = selected_idx + switchValue;
        newLayerIndex = Math.min(newLayerIndex, selectedMarkers_lt.length - 1);
        newLayerIndex = Math.max(newLayerIndex, 0);
        setselected_idx(newLayerIndex);
        break;

      case 'update_cur_layer_info':
        const title = params[0];
        selectedMarkers_lt[selected_idx]['layer_name'] = title.substring(0, 15);
        setselectedMarkers_lt([...selectedMarkers_lt]);
        break;

      case 'setdataLayer':
        const newLayer = params[0];
        selectedMarkers_lt[selected_idx]['layer_data'] = newLayer;
        setselectedMarkers_lt([...selectedMarkers_lt]);
        break;

      case 'delLayer':
        if (selectedMarkers_lt.length > 1) {
          selectedMarkers_lt.splice(selected_idx, 1);
          setselectedMarkers_lt([...selectedMarkers_lt]);
          if (selected_idx > selectedMarkers_lt.length-1){
            setselected_idx(selectedMarkers_lt.length-1);
          }
        }
        break;

      case 'emptymarker':
        const layer_name_tmp = selectedMarkers_lt[selected_idx]['layer_name'];
        const nnnewLayer = { 'layer_name': layer_name_tmp, 'layer_data': [] };
        selectedMarkers_lt[selected_idx] = nnnewLayer;
        setselectedMarkers_lt([...selectedMarkers_lt]);
        break;


      case 'resetLayer':
        const nnewLayer = { 'layer_name': `圖層${selected_idx + 1}`, 'layer_data': [] };
        selectedMarkers_lt[selected_idx] = nnewLayer;
        setselectedMarkers_lt([...selectedMarkers_lt]);
        break;

      case 'readmarkers':
        return selectedMarkers_lt[selected_idx]['layer_data'];
        break;

      case 'addNewLayer':
        const newLayerToAdd = { 'layer_name': `圖層${selectedMarkers_lt.length + 1}`, 'layer_data': [] };
        setselectedMarkers_lt((prevMarkers) => [...prevMarkers, newLayerToAdd]);
        setselected_idx(selectedMarkers_lt.length);
        break;

      case 'addMarktoLayer':
        const markerToAdd = params[0];
        let markerExists = false;

        selectedMarkers_lt[selected_idx]['layer_data'].forEach((existingMarker) => {
          if (existingMarker.name === markerToAdd.name) {
            markerExists = true;
          }
        });

        if (markerExists) {
          console.log('A marker with the same name already exists.');
          return;
        }

        idCounter = idCounter + 1;
        const newMarker = { ...markerToAdd, id: idCounter };
        selectedMarkers_lt[selected_idx]['layer_data'].push(newMarker);
        setselectedMarkers_lt([...selectedMarkers_lt]);
        break;

      default:
        console.error('Unknown action type:', actionType);
    }
  };

  const [accordionStates, setAccordionStates] = useState(markers.map(() => false));

  const [selectedCity, setselectedCity] = useState(["芝加哥"]);

  // State for the visibility of the independent window
  const [independentWindowVisible, setIndependentWindowVisible] = useState(false);

  const openIndependentWindow = () => {
    setIndependentWindowVisible(true);
  };

  const closeIndependentWindow = () => {
    setIndependentWindowVisible(false);
  };

  const jumpToKeywordPlace = (keyword) => {

    const placeName = keyMatches[keyword];

    const placeInfo = all_extractedData[placeName];

    setCenter([placeInfo.lat, placeInfo.lng]);

    setZoom(15);
  };


  const allInputData = {
    markers,
    center,
    zoom,
    noteMatches,
    keyMatches,
    all_extractedData,
    handleLayerAction,
    selectedCity,
    setselectedCity,
    accordionStates,
    setCenter,
    setZoom,
    setMarkers,
    setAccordionStates,
    setnoteMatches,
    setkeyMatches,
    setall_extractedData,
    jumpToKeywordPlace,
    independentWindowVisible,
    openIndependentWindow,
    closeIndependentWindow,
  };
  
  return (
    <div className="App">
      <Router>
        <NavBar_v1 {...allInputData}/>
        <main className="lower-priority-main">
          <Map {...allInputData} />
        </main>
        {/* <MySelect /> */}
      </Router>
    </div>
  );
}

export default App;