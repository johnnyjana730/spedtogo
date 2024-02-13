import React, { useState} from 'react';
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import "./controler.css";
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from "./icons";
import logoImage from './logo.png';

import { MdCleaningServices, MdOutlineAttractions } from 'react-icons/md';
import { PiBowlFood } from 'react-icons/pi';
import { GiJapaneseBridge } from 'react-icons/gi';
import { BiTable } from 'react-icons/bi';
import { colourOptions } from './docs/data';
import MultiSearchBar from 'react-virtualized-select';
import VirtualizedSelect from './VirtualizedSelect'
import "./search.css";
import styles from './search.css'


const RevisionSelect = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    // Add more options as needed
  ];

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  return (
    <div style={{ width: '200px' }}>
      <MultiSearchBar
        options={options}
        onChange={handleSelectChange}
        value={selectedOptions} // Set the selected values here
        placeholder="Select options..."
      />
    </div>
  );
}

const RevisionSelect = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];


  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const { cityData, countryData, nameData } = this.props
  // const { clearable, creatableOptions, disabled, githubUsers, multi, searchable, selectedCity, 
  // selectedCountry, selectedCreatable, selectedGithubUser, selectedName } = this.state
  const clearable = true;
  const creatableOptions = [
      { label: 'Blue', value: '#00F' },
      { label: 'Green', value: '#0F0' },
      { label: 'Red', value: '#F00' }
    ];
  const disabled = false;
  const githubUsers = [];
  const multi = false;
  const searchable = true;
  const selectedCreatable = null;
  const selectedCity = null;

  return ( 
        <VirtualizedSelect
          autofocus
          clearable={clearable}
          disabled={disabled}
          labelKey='name'
          multi={multi}
          onChange={(selectedCity) => this.setState({ selectedCity })}
          options={cityData}
          searchable={searchable}
          simpleValue
          value={selectedCity}
          valueKey='name'
        />

        <ul className={styles.optionsList}>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={multi}
                name='multi'
                onChange={(event) => this.setState({ multi: event.target.checked })}
                type='checkbox'
              />
              Multi-select?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={searchable}
                name='searchable'
                onChange={(event) => this.setState({ searchable: event.target.checked })}
                type='checkbox'
              />
              Searchable?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={clearable}
                name='clearable'
                onChange={(event) => this.setState({ clearable: event.target.checked })}
                type='checkbox'
              />
              Clearable?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={disabled}
                name='disabled'
                onChange={(event) => this.setState({ disabled: event.target.checked })}
                type='checkbox'
              />
              Disabled?
            </label>
          </li>
        </ul>
);
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