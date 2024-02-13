import PropTypes from 'prop-types'
import React, { Component } from 'react'
import 'whatwg-fetch'
import VirtualizedSelect from 'react-virtualized-select'
import styles from './VirtualizedSelect.example.css'


export default class VirtualizedSelectExample extends Component {
  static propTypes = {
    cityData: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props)

    const creatableOptions = [
      { label: 'Blue', value: '#00F' },
      { label: 'Green', value: '#0F0' },
      { label: 'Red', value: '#F00' }
    ]

    this.state = {
      clearable: true,
      creatableOptions,
      disabled: false,
      githubUsers: [],
      multi: true,
      searchable: true,
      selectedCreatable: null,
      selectedCity: "芝加哥"
    }

    this._loadGithubUsers = this._loadGithubUsers.bind(this)
  }

  render () {

    console.log('check');
    
    const { cityData, countryData, nameData, outerselectedCity, setselectedCity, setCenter, setZoom, city_coordinate, setMarkers, setAccordionStates, setselectedMarkers } = this.props
    const { clearable, creatableOptions, disabled, githubUsers, multi, searchable, selectedCity, selectedCountry, selectedCreatable, selectedGithubUser, selectedName } = this.state

    let style_width = '400px';
    let style_transform = 'scale(0.9)';
    let style_left = '300px';

    if (window.innerWidth < 1600){
      style_width = '300px';
      style_left = '300px';
    }

    if (window.innerWidth < 1400){
      style_width = '400px';
      style_transform = 'scale(0.85)';
      style_left = '100px';
    }

    if (window.innerWidth < 1200){
      style_width = '300px';
      style_transform = 'scale(0.85)';
      style_left = '100px';
    }

    if (window.innerWidth < 900){
      style_width = '20px';
      style_transform = 'scale(0.8)';
      style_left = '50px';
    }

    return (
      <div style={{ position: "absolute", width: style_width, transform: style_transform, left: style_left }}>
        <VirtualizedSelect
          autofocus
          clearable={clearable}
          disabled={disabled}
          labelKey='name'
          multi={multi}
          onChange={(selectedOption) => {
            this.setState({ selectedCity: selectedOption });
            // Update the outerselectedCity state in the parent component
            let n_selectedOption = selectedOption + ','

            let selectedCities = n_selectedOption.split(',');

            let lastcity = "";
            for (const city_name of selectedCities) {
              // Perform any other operations with each city
              if (city_name.length > 0) {
                lastcity = city_name;
              }
            }

            if (lastcity.length > 0) {
              const coordinate = city_coordinate[lastcity];
              setCenter([coordinate[0], coordinate[1]]);
              setZoom(12);

            }
            setMarkers([]);
            setAccordionStates([]);
            setselectedMarkers([]);


            // Update the outerselectedCity state in the parent component
            setselectedCity(selectedCities);
          }}
          options={cityData}
          searchable={searchable}
          simpleValue
          value={selectedCity}
          valueKey='name'
        />
      </div>
    )
  }

  _goToGithubUser (value) {
    window.open(value.html_url)
  }

  _loadGithubUsers (input) {
    return fetch(`https://api.github.com/search/users?q=${input}`)
      .then((response) => response.json())
      .then((json) => {
        const githubUsers = json.items

        this.setState({ githubUsers })

        return { options: githubUsers }
      })
  }
}

function CountryOptionRenderer ({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, options, selectValue, style, valueArray, valueKey }) {
  const flagImageUrl = `https://cdn.rawgit.com/hjnilsson/country-flags/9e827754/svg/${option.code.toLowerCase()}.svg`

  const classNames = [styles.countryOption]
  if (option === focusedOption) {
    classNames.push(styles.countryOptionFocused)
  }
  if (valueArray.indexOf(option) >= 0) {
    classNames.push(styles.countryOptionSelected)
  }

  return (
    <div
      className={classNames.join(' ')}
      key={key}
      onClick={() => selectValue(option)}
      onMouseEnter={() => focusOption(option)}
      style={style}
    >
      <label className={styles.countryLabel}>
        {option.name}
      </label>
      <img
        className={styles.countryFlag}
        src={flagImageUrl}
      />
    </div>
  )
}

function NameOptionRenderer ({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray, valueKey }) {
  const classNames = [styles.nameOption]

  if (option.type === 'header') {
    classNames.push(styles.nameHeader)

    return (
      <div
        className={classNames.join(' ')}
        key={key}
        style={style}
      >
        {option.name}
      </div>
    )
  } else {
    if (option === focusedOption) {
      classNames.push(styles.nameOptionFocused)
    }
    if (valueArray.indexOf(option) >= 0) {
      classNames.push(styles.nameOptionSelected)
    }

    return (
      <div
        className={classNames.join(' ')}
        key={key}
        onClick={() => selectValue(option)}
        onMouseEnter={() => focusOption(option)}
        style={style}
      >
        {option.name}
      </div>
    )
  }
}