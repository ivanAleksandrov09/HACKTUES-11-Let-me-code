import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="start-container">
      <h1>Progress Bar Creator</h1>
      <div className="buttons-container">
        <button 
          className="nav-button budget-button"
          onClick={() => navigate('/budget-form')}
        >
          Create Budget Bar
        </button>
        <button 
          className="nav-button goal-button"
          onClick={() => navigate('/goal-form')}
        >
          Create Goal Bar
        </button>
      </div>
    </div>
  );
};

export default StartPage;