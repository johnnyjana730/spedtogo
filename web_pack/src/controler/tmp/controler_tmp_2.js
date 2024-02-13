import React, { useState, useEffect, useRef  } from 'react';
import './controler.css';
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import chevronDown from "./chevron-down.svg";
import styles from "./styles.module.css";
import CustomScroll from 'react-custom-scroll';
import './customScroll.css'
import {DraggableArea} from 'react-draggable-tags';
import deleteBtn from '/img/delete.png';
import deleteBtn2x from '/img/delete@2x.png';

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '0px', // Ensure full height
          width: '100%', // Ensure full height
          lineHeight: '100%', // Vertically center text
        }}
      >
        {header}
        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
      </div>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) =>
        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
);


const IndependentWindow = ({ isVisible, onClose, selectedmarkers, setselectedMarkers }) => {
  const [rotation, setRotation] = useState(0);

  const [windowStyle, setWindowStyle] = useState({
    background: 'rgba(255, 255, 255, 0)',
    left: "-450px",
    top: "620px", // Adjust the value to move it down
    width: "1000px",
    transform: 'rotate(270deg)', // Move left when not expanded

  });

  const clearSelectedMarkers = () => {
    setselectedMarkers([]); // Clears the selected markers
  };


  const onDragEnd = (result) => {
    if (!result.destination) return; // No change in position

    const items = Array.from(selectedmarkers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setselectedMarkers(items);
  };



  if (!isVisible) {
    return null;
  }


  return (
    <div className='independent-window'  style={windowStyle}>
      <Accordion>
        <AccordionItem header="" flexDirection="row" style={{ backgroundColor: 'white' }}>

          <div  style={{ position: "relative", left: "480px", top: "-10px", width: "470px" , height: "460px" }}>
            <button onClick={clearSelectedMarkers} style={{position: "relative", left: "220px", top: "230px", fontSize: '18px', transform: 'rotate(90deg)' }}>Clear Selected Markers</button>
            <div
              style={{
                position: "relative",
                left: '-90px',
                top: "-70px",
                maxHeight: '550px',
                transform: 'rotate(90deg)',
              }}
              >
              <div style = {{ maxHeight: '900px', overflowY: 'auto', marginTop: '20px' }}>
                {selectedmarkers.map((marker, index) => (
                  <div key={index}>
                    {/* Customize the content and structure of each marker's div */}
                    <h3>{marker.name}</h3>
                    <p>{marker.notes}</p>
                    <hr /> {/* Add a horizontal line */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default IndependentWindow;