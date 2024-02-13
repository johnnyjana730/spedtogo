import React from 'react';
import { AccordionItem as Item } from '@szhsin/react-accordion';
import styles from './css/styles.module.css';
import chevronDown from "./img/chevron-down.svg";

const AccordionItem = ({ header, setIsExpanded, ...rest }) => {
  const handleItemClick = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  return (
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
          transform: 'rotate(45deg)', // Rotate by 45 degrees
        }}
      >
        {header}
        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
      </div>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) =>
        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
        onClick: handleItemClick,
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
  );
};


export default AccordionItem;