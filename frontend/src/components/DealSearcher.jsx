import React, { useState } from 'react';
import '../styles/components/DealSearcher.css';
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

const StoreItemGrid = ({ items, variant = 'default' }) => {
    return (
        <div className={`deal-items-grid ${variant}`}>
            {items.map((item, index) => (
                <div className={`deal-item ${variant}`} key={index}>
                    <div className={`deal-content ${variant}`}>
                        <span className="deal-name">{item.name}</span>
                        <span className="deal-value">{item.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};


// export default Input;


const Deals = () => {

    const [searchQuery, setSearchQuery] = useState(''); 


    return (
        <div className="deals-container">
            <h2>Deal searcher</h2>
            <table className="deals-table">
                <thead>
                    <tr>
                        <td colSpan="3" className="search-bar">
                            <input
                                type="text"
                                placeholder="Example: milk, bread..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            /> 
                            <button className="search-button">Search</button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="3">
                            <div className="best-deals">
                                <div className='images'>
                                    <img src={kaufland} alt="Kaufland" className="store-logo" />
                                    <img src={lidl} alt="lidl" className="store-logo" />
                                    <img src={billa} alt="billa" className="store-logo" />
                                </div>
                                < div className="best-deals-content">
                                    <StoreItemGrid
                                        items={[
                                            { name: 'promotion', value: '-50%' },
                                            { name: 'promotion', value: '-55%' },
                                            { name: 'promotion', value: '-40%' },
                                        ]}
                                    />
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