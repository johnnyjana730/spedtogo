let SelectStyles 

SelectStyles  = {
  control: (provided) => ({
    ...provided,
    width: 40, // Adjust the width as needed
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    position: 'absolute',
    width: '150px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  container: (provided) => ({
    ...provided,
    position: 'absolute',
    transform: 'scale(0.8)',
    left: "10px",
    zIndex: 1000000000,
  }),
};


if (window.innerWidth < 1000) {
  SelectStyles  = {
    control: (provided) => ({
      ...provided,
      width: 40, // Adjust the width as needed
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      width: '150px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    container: (provided) => ({
      ...provided,
      position: 'absolute',
      transform: 'scale(0.6)',
      left: "10px",
      top: "20px",
      zIndex: 1000000000,
    }),
  };

}

if (window.innerWidth < 800) {
  SelectStyles  = {
    control: (provided) => ({
      ...provided,
      width: 40, // Adjust the width as needed
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      width: '150px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    container: (provided) => ({
      ...provided,
      position: 'absolute',
      transform: 'scale(0.6)',
      left: "10px",
      top: "10px",
      zIndex: 1000000000,
    }),
  };

}

if (window.innerWidth < 500) {
  SelectStyles  = {
    control: (provided) => ({
      ...provided,
      width: 40, // Adjust the width as needed
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      width: '150px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    container: (provided) => ({
      ...provided,
      position: 'absolute',
      transform: 'scale(0.6)',
      left: "10px",
      top: "15px",
      zIndex: 1000000000,
    }),
  };

}



if (window.innerWidth < 450) {
  SelectStyles  = {
    control: (provided) => ({
      ...provided,
      width: 40, // Adjust the width as needed
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      width: '150px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    container: (provided) => ({
      ...provided,
      position: 'absolute',
      transform: 'scale(0.5)',
      left: "0px",
      top: "20px",
      zIndex: 1000000000,
    }),
  };

}   
    
export default SelectStyles;