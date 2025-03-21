import React from "react";
import "../styles/ProgressBar.css";
import { Link, useNavigate } from "react-router-dom";

const CreateBar = () => {
    const navigate = useNavigate();

    const handleBudgetNav = () => {
        navigate("/budget-bar");
    };

    const handleGoalNav = () => {
        navigate("/goal-bar");
    };

    const handleSeeBarsNav = () => {
        navigate("/bars"); // Assuming you have a route to view all bars
    };

    return (
        <div className="create-bar-container">
            
            <Link
                className="create-bar-button"
                to="/budget-bar"
            >
                Budget Bar
            </Link>

            <Link
                className="create-bar-button"
                to = "/goal-bar"
            >
                Goal Bar
            </Link>

            <button
                className="create-bar-button"
                onClick={handleSeeBarsNav}
            >
                See Bars
            </button>
        </div>
    );
};

export default CreateBar;