import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from "react-router";
import Navigation from "./Navigation";
import { FaInstagram, FaDiscord, FaFacebook } from 'react-icons/fa';
import '../styles/components/Footer.css';

export default function Footer() {
    return (
        <div className="fade-in">
            <header className="header">
                <Navigation />
            </header>
            <Outlet />
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>About Us</h4>
                        <p>Finance Dashboard helps you track and manage your expenses efficiently.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/" className="footer-btn">Home</Link>
                            <Link to="/transactions" className="footer-btn">Transactions</Link>
                            <Link to="/chat" className="footer-btn">Chat</Link>
                            <Link to="/promotions" className="footer-btn">Promotions</Link>
                            <Link to="/stocks" className="footer-btn">Stocks</Link>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="social-icon" />
                            </a>
                            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
                                <FaDiscord className="social-icon" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="social-icon" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Let me code. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}