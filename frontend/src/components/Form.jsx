import { useState } from "react";
import PropTypes from 'prop-types';
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in main-container">
            <form onSubmit={handleSubmit} className="card p-2">
                <h1 className="text-center mb-2">{name}</h1>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    {name}
                </button>
            </form>
            <p className="text-center mt-2">
                {method === "login" ? "Don't have an account? " : "You have an account? "}
                <Link to={method === "login" ? "/register" : "/login"}>
                    {method === "login" ? "Register" : "Log in"}
                </Link>
            </p>
        </div>
    );
}

Form.propTypes = {
    route: PropTypes.string.isRequired,
    method: PropTypes.oneOf(['login', 'register']).isRequired
};

export default Form;