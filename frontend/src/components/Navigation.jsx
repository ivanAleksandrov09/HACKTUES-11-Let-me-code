import { Link } from "react-router-dom";
import "../styles/components/Navigation.css";

function Navigation() {
  return (
    <nav className="nav-container">
      <Link to="/" className="nav-links logo">
        Finance Dashboard
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
      </ul>
      <div>
        <Link className="btn btn-primary" to="/Login">
          Log in
        </Link>
        <Link className="btn btn-primary" to="/Register">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
