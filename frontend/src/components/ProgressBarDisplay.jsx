import React from 'react';
import '../styles/ProgressBarDisplay.css';

const ProgressBarDisplay = ({ progressBars }) => {
    return (
        <div className="progress-bars-container">
            {progressBars.map((bar) => (
                <div key={bar.id} className="progress-bar-item">
                    <div className="progress-info">
                        <h3>{bar.title}</h3>
                        {/* <span>Deadline: {new Date(bar.deadline).toLocaleDateString()}</span> */}
                    </div>
                    <div className="progress-bar-outer">
                        <div 
                            className="progress-bar-inner"
                            style={{ 
                                width: `${bar.progress}%`,
                                backgroundColor: bar.progress < 50 ? '#ff9999' : 
                                                bar.progress < 75 ? '#ffdd99' : '#99ff99'
                            }}
                        ></div>
                        <span className="progress-text">{bar.progress}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBarDisplay;