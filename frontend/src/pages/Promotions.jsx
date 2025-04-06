import Deals from "../components/Deals";
import DealSearcher from "../components/DealSearcher";
import "../styles/pages/Promotion.css";
function Promotions() {
  return (
    <div className="promotions-container fade-in">
      <div style={{ minHeight: "90vh" }}>
        <Deals />
      </div>
      <div style={{ minHeight: "90vh" }}>
        <DealSearcher />
      </div>
    </div>
  );
}
export default Promotions;
