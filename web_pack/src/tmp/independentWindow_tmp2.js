import React, { useState, useEffect } from 'react';
import './independentWindow.css';
import Collapse from 'rc-collapse';
import ReactDOM from 'react-dom';
import 'rc-collapse/assets/index.css';
import LeftBracketImage from './assert/left_bracket.png'; // Adjust the path as needed


const IndependentWindow = ({ isVisible, onClose }) => {

  var Panel = Collapse.Panel;

  const [windowStyle, setWindowStyle] = useState({
    background: 'rgba(255, 255, 255, 0)',
    transform: 'rotate(270deg)', // Move left when not expanded
  });

  const imageStyle = {
    transform: 'rotate(270deg) scale(0.3)', // Rotate 90 degrees and scale down to 50%
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className='independent-window'  style={windowStyle}>
      <Collapse accordion={true}>
        <Panel header={<img src={LeftBracketImage} alt="Left Bracket Icon" style={imageStyle} />} showArrow='false' headerClass="my-header-class">
          <div style={{transform: 'rotate(90deg)', height: '200px' }}>
            this is panel content
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default IndependentWindow;