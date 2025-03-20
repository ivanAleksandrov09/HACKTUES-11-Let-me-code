import React from "react";
import '../styles/ProgressBar.css';

const ProgressBar = ({ 
  curValue, 
  maxValue, 
  barColor = "#4caf50", 
  backgroundColor = "#e0e0e0",
  height = "20px",
  borderRadius = "4px",
  showLabel = true,
  striped = false, // Keep striped option for pattern
  labelFormat = (value) => value,
}) => {
  const percentage = maxValue > 0 ? (curValue / maxValue) * 100 : 0;
  const formattedLabel = labelFormat(curValue);
   
  // Remove animated class options
  let containerClasses = "bar_cont";
  if (striped) containerClasses += " striped";
  
  return (
    <div className={containerClasses} 
    style={{ 
      backgroundColor,
      height,
      borderRadius
      }}
    >
      <div 
        className="bar_fill" 
        style={{ 
          width: `${percentage}%`,
          backgroundColor: barColor,
          borderRadius
        }}
        role="progressbar"
        aria-valuenow={curValue}
        aria-valuemin={0}
        aria-valuemax={maxValue}
      >
        {showLabel && <span className="label">{formattedLabel}</span>}
      </div>
    </div>
  );
};

export default ProgressBar;