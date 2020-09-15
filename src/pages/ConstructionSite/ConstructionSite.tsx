import React, { useState, useEffect } from "react";
import "./ConstructionSite.scss";
import MainTab from '../../components/MainTab/MainTab';

interface Props {}

const ConstructionSite: { (props: Props): JSX.Element } = (props) => {
  // useEffect(() => {

  // });

  return (
    <div className="ConstructionSite">
      <div className="main-content">
      工地
      </div>
      <MainTab index={1} />
    </div>
  );
};

export default ConstructionSite;
