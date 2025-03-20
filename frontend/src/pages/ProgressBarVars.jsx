import React from 'react';
import '../styles/ProgressBar.css';
import ProgressBar from './Goals_Budget';

const BudgetProgressBar = ({ spent, budget, ...props }) => {
    const labelFormat = (value) => `$${value} / $${budget}`;
    
    return (
      <div className="budget-progress">
        <h4>Budget Progress</h4>
        <ProgressBar 
          curValue={spent} 
          maxValue={budget} 
          barColor={spent > budget ? "#ff5252" : "#4caf50"}
          labelFormat={labelFormat}
          {...props}
        />
      </div>
    );
  };
  
  // Goal Progress Bar
  const GoalProgressBar = ({ current, target, title, ...props }) => {
    const percentage = Math.round((current / target) * 100);
    const labelFormat = () => `${percentage}%`;
    
    return (
      <div className="goal-progress">
        <div className="goal-header">
          <h4>{title}</h4>
          <span>{`$${current} of $${target}`}</span>
        </div>
        <ProgressBar 
          curValue={current} 
          maxValue={target}
          labelFormat={labelFormat}
          {...props}
        />
      </div>
    );
  };

  export { BudgetProgressBar, GoalProgressBar };