import { Outlet } from "react-router";
import Navigation from "./components/Navigation";

export default function Layout() {
  return (
    <div className="fade-in">
      <header className="header">
        <Navigation />
      </header>
      <Outlet />
      <footer className="header mt-2">
        <div className="nav-container">
          <p className="text-center footer-txt">
            ©2025 Let me code. All rights reserved
          </p>
          <p className="text-center footer-txt">Something</p>
        </div>
      </footer>
    </div>
  );
}
