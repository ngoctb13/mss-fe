import React from "react";
import "./style.css";

const PageTitle = ({ pageTitle }) => {
  return (
    <div className="header-title">
      <div>{pageTitle}</div>
    </div>
  );
};

export default PageTitle;
