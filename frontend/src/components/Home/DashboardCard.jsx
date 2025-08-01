import React from 'react';
import PropTypes from 'prop-types';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import './DashboardCard.css';

const DashboardCard = ({ 
  title, 
  icon: Icon, 
  value, 
  buttons, 
  cardIndex, 
  onClick 
}) => {
  const handleButtonClick = (action) => {
    if (onClick) {
      onClick(action);
    } else if (action.url) {
      window.location.href = action.url;
    }
  };

  // Use fallback icon if Icon is undefined
  const IconComponent = Icon || BsFillQuestionCircleFill;

  return (
    <div className={`dashboard-card card-${cardIndex}`}>
      <div className="card-inner">
        <h3>{title}</h3>
        <IconComponent className="card_icon" />
      </div>
      
      {value && (
        <h1 className="card-value">{value}</h1>
      )}
      
      {buttons && buttons.length > 0 && (
        <div className="button-container">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`card-button ${index === 0 ? 'primary' : 'secondary'}`}
              onClick={() => handleButtonClick(button)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string
    })
  ),
  cardIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func
};

export default DashboardCard; 