// Example usage in a component
import React from "react";
import ProgressBar from "./Goals_Budget";
import { BudgetProgressBar, GoalProgressBar } from "./ProgressBarVars";

const BudgetsAndGoalsPage = () => {
  return (
    <div className="container">
      <h2>Budgets & Goals</h2>
      
      {/* Basic progress bar */}
      <ProgressBar 
        curValue={75} 
        maxValue={100} 
      />
      
      {/* Custom styled progress bar */}
      <ProgressBar 
        curValue={50} 
        maxValue={100}
        barColor="#2196f3"
        height="30px"
        borderRadius="15px"
        animated={true}
      />
      
      {/* Striped progress bar */}
      <ProgressBar 
        curValue={65} 
        maxValue={100}
        barColor="#ff9800"
        striped={true}
        animated={true}
      />
      
      {/* Budget tracker */}
      <BudgetProgressBar 
        spent={850} 
        budget={1000} 
        height="25px"
      />
      
      {/* Savings goal */}
      <GoalProgressBar 
        current={3500} 
        target={10000} 
        title="Vacation Fund"
        barColor="#8e24aa"
        animated={true}
      />
    </div>
  );
};

export default BudgetsAndGoalsPage;