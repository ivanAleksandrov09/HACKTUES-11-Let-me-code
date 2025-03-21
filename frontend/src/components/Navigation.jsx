import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav className="nav-container">
            <Link className="nav-links logo">Finance Dashboard</Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Transactions</Link></li>
                <li><Link to="/">Info</Link></li>
            </ul>
            <div>
                <Link className="btn btn-primary" to="/Login">Log in</Link>
                <Link className="btn btn-primary" to="/Register">Sign Up</Link>
            </div>
        </nav>
    );
}

export default Navigation; 