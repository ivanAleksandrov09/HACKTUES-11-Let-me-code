import React, { useState, useEffect } from "react";
import "../styles/components/Deals.css";
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

const StoreItemGrid = ({ items }) => {
  return (
    <div className="deal-items-grid">
      {items.map((item, index) => (
        <div className="deal-item" key={index}>
          <span className="deal-name">{item.info}</span>
          <span className="deal-value">-{item.discount}%</span>
        </div>
      ))}
    </div>
  );
};

const Deals = ({ isFetched }) => {
  const [activeStore, setActiveStore] = useState("kaufland");
  const [kaudflandItems, setKauflandItems] = useState([]);
  const [lidlItems, setLidlItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKauflandDeals = async () => {
    try {
      const response = await api.get("/api/leaflet/kaufland/");
      if (response.status === 200) {
        // response.data.response because we return a json object "response"
        // containing the array of deals
        setKauflandItems(response.data.response);
      } else {
        alert("Failed to fetch Kaufland deals");
      }
    } catch (error) {
      console.log("Error when fetching Kaufland deals: ", error);
    }
  };

  const fetchLidlDeals = async () => {
    try {
      const response = await api.get("/api/leaflet/lidl/");
      if (response.status === 200) {
        // response.data.response because we return a json object "response"
        // containing the array of deals
        setLidlItems(response.data.response);
      } else {
        alert("Failed to fetch Kaufland deals");
      }
    } catch (error) {
      console.log("Error when fetching Kaufland deals: ", error);
    }
  };

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchKauflandDeals(), fetchLidlDeals()]);
        isFetched();
      } catch (error) {
        console.error("Error loading deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, [isFetched]);

  const handleClick = (store) => {
    setActiveStore(store);
  };

  return (
    <div className="deals-container">
      <h2>Best deals right now</h2>
      <table className="deals-table">
        <thead>
          <tr>
            <td>
              <StoreButton
                id="kaufland"
                isActive={activeStore === "kaufland"}
                onClick={() => handleClick("kaufland")}
                image={kaufland}
              />
            </td>
            <td>
              <StoreButton
                id="lidl"
                isActive={activeStore === "lidl"}
                onClick={() => handleClick("lidl")}
                image={lidl}
              />
            </td>
            <td>
              <StoreButton
                id="billa"
                isActive={activeStore === "billa"}
                onClick={() => handleClick("billa")}
                image={billa}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            {isLoading && (
              <div className="spinner-container">
                <div className="loading-spinner spinner-fst"></div>
                <div className="loading-spinner spinner-scn"></div>
              </div>
            )}
            {!isLoading && (
              <td colSpan="3">
                <div
                  className={`deals-content ${
                    activeStore === "kaufland" ? "active" : ""
                  }`}
                >
                  <StoreItemGrid items={kaudflandItems} />
                </div>
                <div
                  className={`deals-content ${
                    activeStore === "lidl" ? "active" : ""
                  }`}
                >
                  <StoreItemGrid items={lidlItems} />
                </div>
                <div
                  className={`deals-content ${
                    activeStore === "billa" ? "active" : ""
                  }`}
                >
                  <StoreItemGrid
                    items={[
                      { name: "banani", value: "-20%" },
                      { name: "qbylki", value: "-15%" },
                      { name: "portokali", value: "-10%" },
                      { name: "grozde", value: "-25%" },
                    ]}
                  />
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Deals;
