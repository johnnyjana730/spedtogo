import React, { useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import "./controler.css";
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from "./icons";
import logoImage from './logo.png';

import { MdCleaningServices, MdOutlineAttractions } from 'react-icons/md';
import { PiBowlFood } from 'react-icons/pi';
import { GiJapaneseBridge } from 'react-icons/gi';
import { BiTable } from 'react-icons/bi';
import Select from 'react-select';

const RevisionSelect = () => {
  const [click, setClick] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);
  const handleDropdownClick = () => {
    setClick(!click);
  };


  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

  const handleOptionClick = (option) => {
    if (!selectedOptions.includes(option.value)) {
      setSelectedOptions([...selectedOptions, option.value]);
    } else {
      setSelectedOptions(selectedOptions.filter((value) => value !== option.value));
    }
  };


  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setClick(false);
    }
  };

  // Add a click event listener to detect clicks outside the dropdown panel
  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return ( <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={handleDropdownClick}>
        Choose Options
      </button>
      {click && (
        <div className="dropdown-content">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`option ${selectedOptions.includes(option.value) ? 'selected' : ''}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>);
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
              <props.icon className="icon_nav"/>
              <div className="text-left">{props.text}</div>
            </div>
          </NavLink>
        </li>
      </div>
    </div>
  );
};


function NavBar() {
  const [click, setClick] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleClick = () => setClick(!click);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];



  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <img src={logoImage} alt="City Icon" className="city-icon" style={{ width: '250px', height: '60px', top: '10px', left: '-200px', position: 'absolute', zIndex: 1 }} />
          </NavLink>
          {RevisionSelect()}
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <Nav_Icon text="attractive" icon={MdOutlineAttractions} handleClick={handleClick} toname="/blog" />
            <Nav_Icon text=" chinese food " icon={PiBowlFood} handleClick={handleClick} toname="/blog2" />
            <Nav_Icon text=" JAP food " icon={GiJapaneseBridge} handleClick={handleClick} toname="/blog3" />
            <Nav_Icon text=" control " icon={BiTable} handleClick={handleClick} toname="/blog4" />
            <Nav_Icon text="reset" icon={MdCleaningServices} handleClick={handleClick} toname="/blog5" />
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;