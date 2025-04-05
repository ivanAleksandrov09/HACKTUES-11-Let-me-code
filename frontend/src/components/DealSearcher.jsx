import React, { useEffect, useState } from "react";
import "../styles/components/DealSearcher.css";
import kaufland from "../assets/kaufland.png";
import lidl from "../assets/lidl.png";
import billa from "../assets/billa.png";
import api from "../api";

const StoreButton = ({ id, isActive, onClick, image }) => {
  return (
    <button
      id={id}
      className={`button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <img src={image} alt={id} />
    </button>
  );
};

const StoreItemGrid = ({ items, variant = "default" }) => {
  return (
    <div className={`deal-items-grid ${variant}`}>
      {items.map((item, index) => (
        <div className={`deal-item ${variant}`} key={index}>
          <div className={`deal-content ${variant}`}>
            <span className="deal-name">{item.info}</span>
            <span className="deal-value">{item.discount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// export default Input;

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  const sendQuery = async () => {
    try {
      const response = await api.post("/api/leaflet/user/", {
        prompt: searchQuery,
      });
      if (response.status === 201) {
        console.log(response.data.response);
        setItems(response.data.response);
      } else {
        alert("Failed to find user requested deals.");
      }
    } catch (error) {
      console.log("Error when fetching user deals: ", error);
    }
  };

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
              <button className="search-button" onClick={sendQuery}>
                Search
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3">
              <div className="best-deals">
                <div className="images">
                  <img src={kaufland} alt="Kaufland" className="store-logo" />
                  <img src={lidl} alt="lidl" className="store-logo" />
                  <img src={billa} alt="billa" className="store-logo" />
                </div>
                <div className="best-deals-content">
                  <StoreItemGrid items={items} />
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
