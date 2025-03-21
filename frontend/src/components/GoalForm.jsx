import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PBarForm.css';
import {GoalProgressBar, BudgetProgressBar} from './ProgressBarVars';

const ProgressBarDisplay = ({ progressData }) => {
  return (
    <div className="progress-display">
      <GoalProgressBar 
        current={Number(progressData.current) || 0}
        target={Number(progressData.target) || 100}
        title={progressData.title || 'Goal Progress'}
        barColor={progressData.goalBarColor}
      />
    </div>
  );
};

const GoalForm = () => {
  const [formData, setFormData] = useState({
    // Goal Progress Bar  
    current: '',
    target: '',
    goalBarColor: '#8e24aa',
    title: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/goal-form/', formData);
      setFormData({
        current: '',
        target: '',
        goalBarColor: '#8e24aa', 
        title: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Create New Progress Bars</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Goal Progress Bar</h3>
            <div className="form-group">
              <label>Current Amount:</label>
              <input
                type="number"
                name="current"
                value={formData.current}
                onChange={handleChange}
                placeholder="Enter current amount"
              />
            </div>

            <div className="form-group">
              <label>Target Amount:</label>
              <input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="Enter target amount" 
              />
            </div>

            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter goal title"
              />
            </div>

            <div className="form-group">
              <label>Bar Color:</label>
              <input
                type="color"
                name="goalBarColor"
                value={formData.goalBarColor}  
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit">Create Goal Bars</button>
        </form>
      </div>

      <div className="preview-container">
        <h2>Progress Bars Preview</h2>
        <ProgressBarDisplay progressData={formData} />
      </div>
    </div>
  );
};

export default GoalForm;