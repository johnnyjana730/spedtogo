import React, { useState, useEffect, useRef  } from 'react';
import './controler.css';
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import chevronDown from "./chevron-down.svg";
import styles from "./styles.module.css";
import CustomScroll from 'react-custom-scroll';
import './customScroll.css'
import {DraggableArea} from 'react-draggable-tags';
import deleteBtn from './img/delete.png';
import deleteBtn2x from './img/delete@2x.png';
import style2 from './style.less';

const InitialTags = [{
    id: '1',
    content: 'apple',
  }, {
    id: '2',
    content: 'watermelon',
  }, {
    id: '3',
    content: 'banana',
  }, {
    id: '4',
    content: 'lemon',
  }];

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


  const handleClickDelete = (tag) => {
    const tags_tmp = selectedmarkers.filter(t => tag.id !== t.id);
    setselectedMarkers(tags_tmp);
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
                position: "absolute",
                width: "400px",
                height: "500px",
                left: '80px',
                top: "100px",
                maxHeight: '250px',
                transform: 'rotate(90deg)' 
              }}
              >
              <div style = {{height: "500px", maxHeight: '500px', maxWidth: '400px', overflowY: 'auto', marginTop: '20px' }}>
                <DraggableArea
                  isList
                  tags={selectedmarkers}
                  render={({tag}) => (
                    <div className="row" style={{ fontSize: '12px', color: 'black', marginBottom: '30px', maxHeight: '250px', width: '350px',}}>
                      {tag.name}
                      <img
                        className="delete"
                        src={deleteBtn}
                        srcSet={`${deleteBtn2x} 2x`}
                        onClick={() => handleClickDelete(tag)}
                      />
                    </div>
                  )}
                  onChange={(tags) => setselectedMarkers(tags)}
                />
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default IndependentWindow;