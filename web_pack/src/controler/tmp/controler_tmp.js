import React, { useState, useEffect, useRef  } from 'react';
import './controler.css';
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import chevronDown from "./chevron-down.svg";
import styles from "./styles.module.css";
import CustomScroll from 'react-custom-scroll';
import './customScroll.css'

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
    left: "10px",
    top: "70px", // Adjust the value to move it down
    width: "450px",
    // transform: 'rotate(270deg)', // Move left when not expanded

  });

  const clearSelectedMarkers = () => {
    setselectedMarkers([]); // Clears the selected markers
  };


  if (!isVisible) {
    return null;
  }


  return (
    <div className='independent-window'  style={windowStyle}>
      <Accordion>
        <AccordionItem header="" flexDirection="row" style={{ backgroundColor: 'white' }}>
          <button onClick={clearSelectedMarkers} style={{ fontSize: '18px' }}>Clear Selected Markers</button>
          <div key="native-example" className="container native-scroll"
            style={{
              maxHeight: '750px',
              height: "750px",
              overflowY: 'auto',
            }}
          >

            <div className="panel"  style={{ width: "300px" }}>
              <div className="panel-content-native panel-content">
                <div className="content-fill">
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

            

          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default IndependentWindow;