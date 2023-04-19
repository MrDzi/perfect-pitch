import React, { ReactElement } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import "./page.scss";

const PageWrapper = ({ children }: { children: ReactElement }): ReactElement => {
  const [navigate] = useNavigateWithTransition();
  const goToHome = () => {
    navigate("/home", true);
  };
  return (
    <div className="page">
      <button className="back-button button button--no-border" onClick={goToHome}>
        Back
      </button>
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default PageWrapper;
