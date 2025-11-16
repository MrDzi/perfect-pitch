import React, { ReactElement } from "react";
import { useLocation } from "react-router-dom";
import "./header.scss";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import useScrollDetection from "../../hooks/useScrollDetection";

const Header = (): ReactElement => {
  const location = useLocation();
  const [navigate] = useNavigateWithTransition();
  const isScrolled = useScrollDetection();

  const onLinkClick = (route: string) => {
    return () => {
      const isBackNavigation = route === "/";
      navigate(route, isBackNavigation);
    };
  };

  return (
    <div className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <nav className="nav">
          <button className={`nav-link ${location.pathname === "/" ? "active" : ""}`} onClick={onLinkClick("/")}>
            HOME
          </button>
          <button
            className={`nav-link ${location.pathname.startsWith("/blog") ? "active" : ""}`}
            onClick={onLinkClick("/blog")}
          >
            BLOG
          </button>
        </nav>
        <a href="https://www.buymeacoffee.com/steam_roller" target="_blank" rel="noreferrer">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-black.png" alt="Buy Me A Coffee" width="110" />
        </a>
      </div>
    </div>
  );
};

export default Header;
