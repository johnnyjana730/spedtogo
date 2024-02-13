import React, { useState } from 'react';
import { View } from 'react-native';
import './css/controler.css';
import { Accordion } from "@szhsin/react-accordion";
import {DraggableArea} from 'react-draggable-tags';
import AccordionItem from './AccordionItem';
import { CSVLink } from "react-csv";
import { PiExport } from 'react-icons/pi';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { BsLayers } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import place_styles from './place_info_style'
import { MainComponent, GuideSection } from './component';
import * as XLSX from 'xlsx';

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ControlIcon = (props) => {
  return (
    <div className="icon-container">
      <props.icon className="icon" onClick={props.handleClick} />
      <div className="label">{props.text}</div>
    </div>
  );
};


function getXlsxData(selectedMarkers) {
  const xlsxData = [];

  selectedMarkers.forEach(marker => {
    const roundedLatitude = marker.position[0].toFixed(3);
    const roundedLongitude = marker.position[1].toFixed(3);
    const point = "POINT (" + roundedLongitude + ' ' + roundedLatitude + ')';

    // Remove special characters from marker.name
    // const cleanedName = marker.name.replace(/[^\w\s]/gi, ''); // This removes non-alphanumeric characters

    xlsxData.push({
      WKT: point,
      name: marker.name,
    });
  });

  return xlsxData;
}


function exportToXlsx(data, filename = 'export.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
}


const IndependentWindow = ({ isVisible, onClose, setCenter, setZoom, handleLayerAction, noteMatches, keyMatches, all_extractedData, jumpToKeywordPlace}) => {

  let zIndexCounter = 500;

  const [isExpanded, setIsExpanded] = useState(true); // Initially, set it to true or false based on your requirement


  const handleClickDelete = (tag) => {
    const tags_tmp = handleLayerAction('readmarkers').filter(t => tag.id !== t.id);
    handleLayerAction('setdataLayer', tags_tmp);
  };

  const handleButtonClick = (tag) => {
    // Your button click logic here, for example:
    setCenter([tag.position[0], tag.position[1]]);
    setZoom(15);
    // Add more logic as needed
  };

  const handleButtonexport = () => {
    exportToXlsx(getXlsxData(handleLayerAction('readmarkers')), handleLayerAction('readlayertitle') + '.xlsx');
  };


  const handleButtonaddLayer = () => {
    handleLayerAction('addNewLayer');
  };

  const handleButtoncleanLayer = () => {
    handleLayerAction('resetLayer');
  };

  const handleButtondelLayer = () => {
    handleLayerAction('delLayer');
  };


  if (!isVisible) {
    return null;
  }
  return (

    <div className='independent-window'    style={{width: isExpanded ? '35px' : '900px',  
            left: isExpanded ? '-20px' : '-450px', top: isExpanded ? '60px' : '410px', zIndex: 20000000}}>
      <Accordion>
        <AccordionItem header="" setIsExpanded={setIsExpanded} flexDirection="row" style={{ backgroundColor: 'white'}}>
          <div  className="inner_window">
            <div className="button_container">
               <ControlIcon text="Export" icon={PiExport} handleClick={handleButtonexport}/>
               <ControlIcon text="Clean" icon={MdOutlineCleaningServices} handleClick={handleButtoncleanLayer} />>
               <ControlIcon text="Add Layer" icon={BsLayers} handleClick={handleButtonaddLayer}/>
               <ControlIcon text="Del Layer" icon={BsLayers} handleClick={handleButtondelLayer}/>
            </div>

            <div className="inner_window_container">

              <div className="map_layer">
                 <span style={{fontSize: '20px', marginLeft: '20px' , fontFamily: 'Roboto, Arial, sans-serif' }}>
                      {handleLayerAction('readlayertitle')}
                  </span>


                <button className="switch_layer1" onClick={() => handleLayerAction('switch_layer', -1)}>
                  <FaChevronLeft />
                </button>

                <button className="switch_layer2" onClick={() => handleLayerAction('switch_layer', 1)}>
                  <FaChevronRight />
                </button>

              </div>

              <div className="scrollable-div">
                <div className="List">
                    <DraggableArea
                      isList
                      tags={handleLayerAction('readmarkers')}
                      render={({tag}) => (
                        <View style={[place_styles.card, { flexDirection: "column", zIndex: 1}]}>
                          <MainComponent tag={tag} handleButtonClick={handleButtonClick} handleClickDelete={handleClickDelete} style={{ zIndex: zIndexCounter-- }}  />
                          <GuideSection tag={tag} noteMatches={noteMatches} keyMatches={keyMatches} all_extractedData={all_extractedData} style={{ zIndex: zIndexCounter-- }} jumpToKeywordPlace={jumpToKeywordPlace} />
                        {zIndexCounter += 100}
                        </View>

                      )}
                      onChange={tags => handleLayerAction('setdataLayer', tags)}
                    />
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>

    </div>
  );
};

export default IndependentWindow;