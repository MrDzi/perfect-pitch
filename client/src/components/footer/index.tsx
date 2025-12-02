import React, { ReactElement } from "react";
import { useLocation } from "react-router-dom";
import "./footer.scss";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";

const Footer = (): ReactElement => {
  const location = useLocation();
  const [navigate] = useNavigateWithTransition();

  const onLinkClick = (route: string) => {
    return () => {
      const isBackNavigation = route === "/";
      navigate(route, isBackNavigation);
    };
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <button
            className={`footer-link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={onLinkClick("/about")}
          >
            about
          </button>
          <button
            className={`footer-link ${location.pathname === "/privacy-policy" ? "active" : ""}`}
            onClick={onLinkClick("/privacy-policy")}
          >
            privacy policy
          </button>
          <button
            className={`footer-link ${location.pathname === "/terms-conditions" ? "active" : ""}`}
            onClick={onLinkClick("/terms-conditions")}
          >
            terms & conditions
          </button>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
