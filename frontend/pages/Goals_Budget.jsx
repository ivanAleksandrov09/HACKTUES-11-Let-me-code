import React from "react";
import '../styles/ProgressBar.css';

const ProgressBar = ({curValue},{maxValue}) => {
    return (
      <div className="bar_cont">
        <div 
        className="bar_fill" 
        style={{ width: `${(curValue / maxValue) * 100}%` }}
        role = "progressbar"
        aria-valuenow={curValue}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        >
          <span className="label">{curValue}</span>
        </div>
        </div>
    );
};

export default ProgressBar;