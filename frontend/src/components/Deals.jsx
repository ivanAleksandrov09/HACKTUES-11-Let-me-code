import React, { useState } from 'react';
import '../styles/components/Deals.css';
import kaufland from '../assets/kaufland.png';
import lidl from '../assets/lidl.png';
import billa from '../assets/billa.png';

const Deals = () => {
    const [activeStore, setActiveStore] = useState('kaufland');

    const handleClick = (store) => {
        setActiveStore(store);
    }

    return (
        <div className="deals-container">
            <h2>Best deals right now</h2>
            <table className="deals-table">
                <thead>
                    <tr>
                        <td>
                            <button 
                                id='kaufland' 
                                className={`button ${activeStore === 'kaufland' ? 'active' : ''}`}
                                onClick={() => handleClick('kaufland')}
                            >
                                <img src={kaufland} alt="kaufland" />
                            </button>
                        </td>
                        <td>
                            <button 
                                id='lidl' 
                                className={`button ${activeStore === 'lidl' ? 'active' : ''}`}
                                onClick={() => handleClick('lidl')}
                            >
                                <img src={lidl} alt="lidl" />
                            </button>
                        </td>
                        <td>
                            <button 
                                id='billa' 
                                className={`button ${activeStore === 'billa' ? 'active' : ''}`}
                                onClick={() => handleClick('billa')}
                            >
                                <img src={billa} alt="billa" />
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="3">
                            <div className={`deals-content ${activeStore === 'kaufland' ? 'active' : ''}`}>
                                <div className="deal-items-grid">
                                    <div className="deal-item">
                                        <span className="deal-name">kartofi -20%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">kartofi -20%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">kartofi -20%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">kartofi -20%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`deals-content ${activeStore === 'lidl' ? 'active' : ''}`}>
                                <div className="deal-items-grid">
                                    <div className="deal-item">
                                        <span className="deal-name">hlqb -35%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">hlqb -35%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">hlqb -35%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">hlqb -35%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`deals-content ${activeStore === 'billa' ? 'active' : ''}`}>
                                <div className="deal-items-grid">
                                    <div className="deal-item">
                                        <span className="deal-name">mqso -21%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">mqso -21%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">mqso -21%</span>
                                    </div>
                                    <div className="deal-item">
                                        <span className="deal-name">mqso -21%</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Deals;