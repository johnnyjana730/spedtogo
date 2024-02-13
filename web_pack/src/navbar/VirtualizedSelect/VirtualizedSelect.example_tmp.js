import PropTypes from 'prop-types'
import React, { Component } from 'react'
import 'whatwg-fetch'
import VirtualizedSelect from 'react-virtualized-select'
import styles from './VirtualizedSelect.example.css'


export default class VirtualizedSelectExample extends Component {
  static propTypes = {
    cityData: PropTypes.array.isRequired,
    countryData: PropTypes.array.isRequired,
    nameData: PropTypes.array.isRequired
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
      selectedCity: null
    }

    this._loadGithubUsers = this._loadGithubUsers.bind(this)
  }

  render () {
    const { cityData, countryData, nameData } = this.props
    const { clearable, creatableOptions, disabled, githubUsers, multi, searchable, selectedCity, selectedCountry, selectedCreatable, selectedGithubUser, selectedName } = this.state

    return (
      <div>
        <h4 className={styles.header}>
          Default Option Renderer
        </h4>

        <div className={styles.description}>
          Displays a list of the 1,000 largest cities in the world using the default option-renderer.
        </div>

        <div className={styles.description}>
          Cities with names beginning with "y" have been disabled.
        </div>

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