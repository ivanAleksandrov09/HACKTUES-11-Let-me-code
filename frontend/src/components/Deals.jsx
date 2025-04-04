import React, { useState } from 'react';
import '../styles/components/Deals.css';
import kaufland from '../assets/kaufland.png';
import lidl from '../assets/lidl.png';
import billa from '../assets/billa.png';

const StoreButton = ({ id, isActive, onClick, image }) => {
    return (
        <button
            id={id}
            className={`button ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <img src={image} alt={id} />
        </button>
    );
};

const StoreItemGrid = ({ items }) => {
    return (
        <div className="deal-items-grid">
            {items.map((item, index) => (
                <div className="deal-item" key={index}>
                    <span className="deal-name">{item.name}</span>
                    <span className="deal-value">{item.value}</span>
                </div>
            ))}
        </div>
    );
};

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
                            <StoreButton
                                id="kaufland"
                                isActive={activeStore === 'kaufland'}
                                onClick={() => handleClick('kaufland')}
                                image={kaufland}
                            />
                        </td>
                        <td>
                            <StoreButton
                                id="lidl"
                                isActive={activeStore === 'lidl'}
                                onClick={() => handleClick('lidl')}
                                image={lidl}
                            />
                        </td>
                        <td>
                            <StoreButton
                                id="billa"
                                isActive={activeStore === 'billa'}
                                onClick={() => handleClick('billa')}
                                image={billa}
                            />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="3">
                            <div className={`deals-content ${activeStore === 'kaufland' ? 'active' : ''}`}>
                                <StoreItemGrid
                                    items={[
                                        { name: 'banani', value: '-20%' },
                                        { name: 'qbylki', value: '-15%' },
                                        { name: 'portokali', value: '-10%' },
                                        { name: 'grozde', value: '-25%' },
                                    ]}
                                />
                            </div>
                            <div className={`deals-content ${activeStore === 'lidl' ? 'active' : ''}`}>
                                <StoreItemGrid
                                    items={[
                                        { name: 'banani', value: '-20%' },
                                        { name: 'qbylki', value: '-15%' },
                                        { name: 'portokali', value: '-10%' },
                                        { name: 'grozde', value: '-25%' },
                                    ]}
                                />
                            </div>
                            <div className={`deals-content ${activeStore === 'billa' ? 'active' : ''}`}>
                                <StoreItemGrid
                                    items={[
                                        { name: 'banani', value: '-20%' },
                                        { name: 'qbylki', value: '-15%' },
                                        { name: 'portokali', value: '-10%' },
                                        { name: 'grozde', value: '-25%' },
                                    ]}
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Deals;