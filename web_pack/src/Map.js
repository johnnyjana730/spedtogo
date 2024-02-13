import React, { useState, useEffect } from 'react';
import {
  plotMap,
  addMarker,
  handleClearMarkers,
  renderMarkers,
  addLAMarker,
  useMapState
} from './map/mapFunctions';
import IndependentWindow from './controler/controler'; // Import your new component
import { Button} from 'react-bootstrap';
import { useCollapse } from 'react-collapsed';
import { MdCleaningServices, MdOutlineAttractions } from 'react-icons/md';
import { PiBowlFood } from 'react-icons/pi';
import { GiJapaneseBridge } from 'react-icons/gi';
import { BiTable } from 'react-icons/bi';

const elementRef = React.useRef<HTMLDivElement>(null);



const Map = (props) => {
  const center = props.center;

  const toggleAccordion = (index) => {
    const newAccordionStates = [...props.accordionStates];
    newAccordionStates[index] = !newAccordionStates[index];
    props.setAccordionStates(newAccordionStates);
  };

  const [showtext, setshowtext] = useState(0); 

  const inputdata = {
    center,
    zoom: props.zoom,
    markers: props.markers,
    noteMatches: props.noteMatches,
    keyMatches: props.keyMatches,
    setMarkers: props.setMarkers,
    all_extractedData: props.all_extractedData,
    setCenter: props.setCenter,
    setZoom: props.setZoom,
    setnoteMatches: props.setnoteMatches,
    addNewLayer: props.addNewLayer,
    switch_layer: props.switch_layer,
    handleLayerAction: props.handleLayerAction,
    setkeyMatches: props.setkeyMatches,
    accordionStates: props.accordionStates,
    toggleAccordion: toggleAccordion,
    jumpToKeywordPlace: props.jumpToKeywordPlace,
    isVisible: props.independentWindowVisible,
    onClose: props.closeIndependentWindow,
    selectedCity: props.selectedCity,
    showtext: showtext,
    setshowtext: setshowtext,
  };

  return (
    <div>

      {plotMap(inputdata)}
      

      {/* Render the independent window component */}
      {IndependentWindow(inputdata)}
    
    </div>
  );
};

export default Map;