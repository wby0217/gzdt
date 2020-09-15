import React, { useState, useEffect } from "react";
import "./VideoMonitor.scss";
import MainTab from '../../components/MainTab/MainTab';

interface Props {}

const VideoMonitor: { (props: Props): JSX.Element } = (props) => {
  // useEffect(() => {

  // });

  return (
    <div className="VideoMonitor">
      <div className="main-content">
      视频监控
      </div>
      <MainTab index={2} />
    </div>
  );
};

export default VideoMonitor;
