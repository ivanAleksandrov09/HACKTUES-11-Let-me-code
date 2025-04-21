import Deals from "../components/Deals";
import DealSearcher from "../components/DealSearcher";
import "../styles/pages/Promotion.css";
import { useState } from "react";
import { Suspense } from "react";

function Promotions() {
  const [dealsFetched, setDealsFetched] = useState(false);
  return (
    <div className="promotions-container fade-in">
      <div style={{ minHeight: "90vh" }}>
        <Suspense
          fallback={
            <div>
              <div className="loading-spinner spinner-fst"></div>
              <div className="loading-spinner spinner-scn"></div>
            </div>
          }
        >
          <Deals isFetched={() => setDealsFetched(true)} />
        </Suspense>
      </div>
      <div style={{ minHeight: "90vh" }}>
        {dealsFetched && <DealSearcher />}
        {!dealsFetched && (
          <div>
            <div className="loading-spinner spinner-fst"></div>
            <div className="loading-spinner spinner-scn"></div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Promotions;
