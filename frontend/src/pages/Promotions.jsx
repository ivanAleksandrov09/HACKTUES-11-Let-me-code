import Deals from "../components/Deals";
import DealSearcher from "../components/DealSearcher";
import "../styles/pages/Promotion.css";
import { useState } from "react";

function Promotions() {
  const [dealsFetched, setDealsFetched] = useState(false);
  return (
    <div className="promotions-container fade-in">
      <div style={{ minHeight: "90vh" }}>
        <Deals isFetched={() => setDealsFetched(true)}/>
      </div>
      <div style={{ minHeight: "90vh" }}>
        {dealsFetched && <DealSearcher />}
        {!dealsFetched && <div id='loadingSearcher'>Loading...</div>}
      </div>
    </div>
  );
}
export default Promotions;
