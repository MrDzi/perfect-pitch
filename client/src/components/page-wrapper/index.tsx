import React, { ReactElement } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import BackArrow from "../../assets/icons/back-arrow";
import "./page.scss";

const PageWrapper = ({ children }: { children: ReactElement }): ReactElement => {
  const [navigate] = useNavigateWithTransition();
  const goToHome = () => {
    navigate("/", true);
  };
  return (
    <div className="page page--game">
      <div className="page--game__inner">
        <button className="back-button button button--no-border flex flex-center" onClick={goToHome}>
          <BackArrow />
          <span>Back</span>
        </button>
        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
