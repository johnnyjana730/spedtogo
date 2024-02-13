import React, { useState, useEffect } from 'react';
import './independentWindow.css';
import Collapse from 'rc-collapse';
import ReactDOM from 'react-dom';
import 'rc-collapse/assets/index.css';
import LeftBracketImage from './assert/left_bracket.png'; // Adjust the path as needed


function expandIcon({ isActive }) {
  return (
    <i style={{ position: 'absolute', top: '50%',left: '47%' }}>
      <svg
        viewBox="0 0 11 11"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{
          verticalAlign: '-.125em',
          transition: 'transform .2s',
          transform: `rotate(${isActive ? 90 : 270}deg)`,
        }}
      >
        <image
          x="0"
          y="0"
          width="8"
          height="8"
          xlinkHref={LeftBracketImage}
        />
      </svg>
    </i>
  );
}

const IndependentWindow = ({ isVisible, onClose }) => {
  const customStyles = {
    border: '1.5px solid black', // Add the border for the outline
    borderRadius: '5px', // Add rounded corners for a better appearance
    padding: '1px', // Add padding for spacing
    background: 'rgb(220, 220, 220)',
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.2)' // Add a box shadow
  };

  var Panel = Collapse.Panel;

  const [windowStyle, setWindowStyle] = useState({
    background: 'rgba(255, 255, 255, 0)',
    transform: 'rotate(270deg)', // Move left when not expanded
  });


  if (!isVisible) {
    return null;
  }

  const theme = {
  collapse: 'ReactCollapse--collapse',
  content: 'ReactCollapse--content'
  }

  return (
    <div className='independent-window'  style={windowStyle}>
      <Collapse theme={theme} accordion={true}  expandIcon={expandIcon} style={customStyles}>
        <Panel className="small-panel" headerClass="my-header-class">
          <div style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed', // This ensures that the text appears upright
              // Other CSS properties go here
          }}>
            this is panel content
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default IndependentWindow;