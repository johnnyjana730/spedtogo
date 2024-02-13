// MapFunctions.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { loadPlacesData, readNoteMatch, getMarkerIcon, getMarkerIconHL } from '../data/dataLoader'; // Adjust the path to the dataLoader.js file
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, ZoomControl  } from 'react-leaflet';
import * as IconVariables from './mapVariables';
import RestaurantCard from './popBox_layout';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOM from 'react-dom'; // Import ReactDOM here
import { BiRestaurant } from 'react-icons/bi';
import './icon.css';
import MarkerClusterGroup from 'react-leaflet-cluster'

let idCounter = 0;

// Create a divIcon with text
const textIcon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [300, 300],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    html: '<div>My Text</div>'
});


function ZoomLevelIndicator({showtext, setshowtext, markers}) {
  const map = useMap();
  let mapBounds = 1;
  
  useEffect(() => {
    const updateZoomLevel = () => {
      const zoomLevel = map.getZoom();
      mapBounds = map.getBounds();

      const visibleMarkers = markers.filter(marker =>
        mapBounds.contains(marker.position)
      );

      // Check the zoom level and set showtext accordingly
      if (zoomLevel > 16 || visibleMarkers.length < 5) {
        // If showtext is changing from 0 to 1, add a delay before updating the state
          setTimeout(() => {
            setshowtext(1);
          }, 200);
      } else if (zoomLevel > 12 && visibleMarkers.length < 10) {
          setTimeout(() => {
            setshowtext(1);
          }, 200);
      } else if (zoomLevel <= 10 || visibleMarkers.length >= 10) {
        setshowtext(0);
      }

    };

    map.on('zoom', updateZoomLevel); // Listen for zoom level changes

    // Clean up the event listener when the component unmounts
    return () => {
      map.off('zoom', updateZoomLevel);
    };
  }, [map, markers, setshowtext, mapBounds]); // Ensure the effect runs when the map instance changes

  return <div></div>;
}


export const plotMap = ({center, setCenter, zoom, setZoom, markers, noteMatches, keyMatches, all_extractedData, showtext, jumpToKeywordPlace, setshowtext, selectedCity, handleLayerAction, accordionStates, toggleAccordion}) => {
    const isNotMobile = window.innerWidth > 1300;

    const mapsize = isNotMobile ? window.innerHeight - 60 : window.innerHeight - 45;
// 
//     const jumpToKeywordPlace = (keyword) => {
// 
//       const placeName = keyMatches[keyword];
// 
//       const placeInfo = all_extractedData[placeName];
// 
//       setCenter([placeInfo.lat, placeInfo.lng]);
// 
//       setZoom(12);
//     };

    return (
      <MapContainer
        center={center}
        key={center.toString()}
        zoom={zoom}
        style={{ width: 'auto', height: mapsize, overflow: 'hidden' }}
        zoomControl={false} 
        >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution={
              isNotMobile ? (
                '&copy; <a href="https://carto.com/attributions">Carto</a>'
              ) : (
                null
              )
            }
        />
        {isNotMobile && <ZoomControl position="bottomright" />}
        <ZoomLevelIndicator showtext={showtext} setshowtext={setshowtext} markers={markers}/>

        <div style={{ transform: 'scale(0.5)' }}>

          {showtext === 1 ? (
            // Render individual markers when showtext is 1
            renderMarkers(markers, noteMatches, keyMatches, all_extractedData, showtext,  handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace, true)
          ) : (
            // Render MarkerClusterGroup when showtext is not 1
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={100}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={true}
            >
              {renderMarkers(markers, noteMatches, keyMatches, all_extractedData, showtext,handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace, true)}
            </MarkerClusterGroup>

          )}

              {renderMarkers(markers, noteMatches, keyMatches, all_extractedData, showtext, handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace, false)}
              {renderTripMarkers(markers, noteMatches, keyMatches, all_extractedData, showtext, handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace)}

          </div>

      </MapContainer>
    );
};

export const renderMarkers = (markers, noteMatches, keyMatches, all_extractedData, showtext, handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace, skip) => {

  const isNotMobile = window.innerWidth > 800;

  const minimumWidth = isNotMobile ? 500 : 200;

  const showtext_fontsize = isNotMobile ? '16px' : '12px';

  // const handleMarkerDragEnd = (index, event) => {
  //   const { lat, lng } = event.target.getLatLng();
  //   // Update the marker position in your state or data structure
  //   // Example using React and assuming you have a state variable named 'markers'
  //   const updatedMarkers = [...markers];
  //   updatedMarkers[index] = { ...updatedMarkers[index], position: { lat, lng } };
  //   selectedmarkers(updatedMarkers); // Assuming you are using React and have a state variable setMarkers
  // };


  const zidnex_value = skip ? 100 : 150;

  return markers.map((marker, index) => {
    if (marker.top_ranked == skip) {
      // Skip this marker if top_ranked is true and skip is true
      return null;
    }

    return (
      <Marker key={index} position={marker.position} icon={getMarkerIcon(marker.place_type, marker.color, marker.top_ranked)}
        zIndexOffset={zidnex_value}
        draggable={true} // Add this line to make the marker draggable 
      >
        {showtext === 1 ? (
          <Tooltip direction="right" offset={[10, 3]} opacity={1} permanent>
            <div style={{ fontSize: showtext_fontsize }}>
              {marker.name}
            </div>
          </Tooltip>
        ) : null}

        <Popup
          minWidth={Math.min(minimumWidth, 300 + (marker.name.length - 10) * 3)}
          style={{ position: 'absolute', top: 100, left: 0, zIndex: zidnex_value}}
        >
          <View>
            <RestaurantCard
              marker={marker}
              noteMatches={noteMatches}
              keyMatches={keyMatches}
              all_extractedData={all_extractedData}
              handleLayerAction={handleLayerAction}
              jumpToKeywordPlace={jumpToKeywordPlace}
              isAccordionOpen={accordionStates[index]}
              toggleAccordion={() => toggleAccordion(index)}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: zidnex_value, }} // Set a higher zIndex for the RestaurantCard
            />
          </View>
        </Popup>
      </Marker>
    );
  });

};

const renderTripMarkers = (markers, noteMatches, keyMatches, all_extractedData, showtext, handleLayerAction, accordionStates, toggleAccordion, jumpToKeywordPlace) => {

  const isNotMobile = window.innerWidth > 800;

  const minimumWidth = isNotMobile ? 500 : 200;

  const showtext_fontsize = isNotMobile ? '16px' : '12px';

  return handleLayerAction('readmarkers').map((marker, index) => (
    <Marker key={index} position={marker.position} icon={getMarkerIconHL(marker.place_type, marker.color)} zIndexOffset={1000}
    draggable={true} // Add this line to make the marker draggable
    >
      {showtext === 1 ? (
        <Tooltip direction="right" offset={[10, 3]} opacity={1} permanent>
          <div style={{ fontSize: showtext_fontsize }}>
            {marker.name}
          </div>
        </Tooltip>
      ) : null}

      <Popup
          minWidth={Math.min(minimumWidth, 300 + (marker.name.length - 10) * 3)}
          style={{ position: 'absolute', top: 100, left: 0}}
      >
      <View>
        <RestaurantCard
          marker={marker}
          noteMatches={noteMatches}
          keyMatches={keyMatches}
          all_extractedData={all_extractedData}
          handleLayerAction={handleLayerAction}
          jumpToKeywordPlace={jumpToKeywordPlace}
          isAccordionOpen={accordionStates[index]}
          toggleAccordion={() => toggleAccordion(index)}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 200 }} // Set a higher zIndex for the RestaurantCard
        />
      </View>
    </Popup>
    </Marker>
  ));
};




export const handleClearMarkers = (handleLayerAction, setAccordionStates) => {
  handleLayerAction('emptymarker');
  setAccordionStates([]);
};


export const addMarker = (name, place_type, rating, noteKeyInfo, notes, latitude, longitude, color, top_ranked, setMarkers, setAccordionStates) => {
  const newId = idCounter + 1;
  idCounter = idCounter + 1;

  const newMarker = {
    id: newId,
    place_type: place_type,
    name: name,
    noteKeyInfo: noteKeyInfo,
    notes: notes,
    description: 'description',
    rating: rating,
    relatedGuide: 'relatedGuide',
    position: [latitude, longitude],
    color: color,
    top_ranked: top_ranked,
  };

  setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  setAccordionStates((prevAccordionStates) => [...prevAccordionStates, false]);
};


export const addMarkers = async (city_name, jsonFileName, setMarkers, setAccordionStates) => {
  setMarkers([]);
  setAccordionStates([]);

  // const notesMatches = result2.notesMatches;
  try {
    const result  = await loadPlacesData(city_name, jsonFileName);
    const extractedData = result.extractedData;

    const colorMap = {
      'LA_viewpt': 'red',
      'LA_chinesefood': 'blue',
      'LA_japanesefood': 'gold',
      default: 'grey'
    };

    const color = colorMap[jsonFileName] || colorMap.default;

    for (const placeName in extractedData) {
      const placeInfo = extractedData[placeName];

      addMarker(placeName, placeInfo.type, placeInfo.rating, placeInfo.noteKeyInfo, placeInfo.notes, 
          placeInfo.lat, placeInfo.lng, color, placeInfo.top_ranked, setMarkers, setAccordionStates);
    }
  } catch (error) {
    console.error(error);
  }
};



export const addCityMarker = async (selectedCity, cityMappings, jsonFileName, uniCategories, setMarkers, setAccordionStates, setnoteMatches, setkeyMatches, setall_extractedData) => {
  setMarkers([]);
  setAccordionStates([]);


  const results  = await readNoteMatch(selectedCity, cityMappings, uniCategories);
  const all_notes_matches = results.notes_matches;
  const all_extractedData = results.extractedData;
  const all_ketword_matches = results.ketword_matches;


  setnoteMatches(all_notes_matches);
  setkeyMatches(all_ketword_matches);
  setall_extractedData(all_extractedData);

  for (const city_name of selectedCity) {
    // Perform any other operations with each city
    const mappedCity = cityMappings[city_name] || city_name;

    const fileNameParts = jsonFileName.split('_');
    // Iterate over the parts and call addMarkers for each
    for (const part of fileNameParts) {
      addMarkers(mappedCity, part, setMarkers, setAccordionStates);
    }

  }
};




export function useMapState() {
  const [center, setCenter] = useState([41.8781, -87.6298]);
  const [zoom, setZoom] = useState(10);
  const [loading, setLoading] = useState(false);

   // (34.0522, -118.2437)
// 
//   useEffect(() => {
//     function successGPS(position) {
//       setCenter([position.coords.latitude, position.coords.longitude]);
//       setLoading(false);
//     }
// 
//     function errorGPS() {
//       window.alert('error no GPS info');
//     }
// 
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
//     } else {
//       window.alert('error no GPS info');
//     }
//   }, []);

  return {center, loading, setCenter, zoom, setZoom};
}