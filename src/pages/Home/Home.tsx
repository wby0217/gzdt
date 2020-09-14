import React, { useState, useEffect } from "react";
import "./Home.scss";
import { cloudtplus } from '../../utils/cloudtplus';
import GeneralSituation from '../GeneralSituation/GeneralSituation';
import ConstructionSite from '../ConstructionSite/ConstructionSite';
import VideoMonitor from '../VideoMonitor/VideoMonitor';
import { useGlobalUserStore, GlobalUserInfo, UserRole } from '../../store/useGlobalUserStore';
import { resourceBase } from '../../utils/core';

interface Props {}

const Home: { (props: Props): JSX.Element } = (props) => {
  const { globalUser, updateGlobalUser } = useGlobalUserStore();
  const [count, setCount] = useState(0);

  let userInfo: GlobalUserInfo = {
    username: '123',
    token: '123',
    role: UserRole.USER
  };

  useEffect(() => {
    console.log('useEffect');
    updateGlobalUser(userInfo);
  }, []);

  cloudtplus(
    'updateTitlebar',
    (res) => { },
    (err) => { },
    {
        text: "首页",
        backgroundColor: '#136EE4'
    }
  );

  cloudtplus(
      'showScanButton',
      (res) => { },
      (err) => { }
  );

  const switchPanel = (i) => {
    setCount(i);
  };

  console.log(globalUser);
  const setContent = (count) => {
    return count === 0 ? <GeneralSituation /> : count === 1 ? <ConstructionSite /> : <VideoMonitor />;
  };

  return (
    <div className="Home">

      {
        setContent(count)
      }

      <div className="btn-wrap">
        <div
          className={`button ${count === 0 ? 'changeBtn' : ''}`}
          onClick={() => switchPanel(0)}
        >
          <img src={`${resourceBase}/images/logo.png`} />
          <span>概况</span>
        </div>
        <div
          className={`button ${count === 1 ? 'changeBtn' : ''}`}
          onClick={() => switchPanel(1)}
        >
          <img src={`${resourceBase}/images/logo.png`} />
          <span>数字工地</span>
        </div>
        <div
          className={`button ${count === 2 ? 'changeBtn' : ''}`}
          onClick={() => switchPanel(2)}
        >
          <img src={`${resourceBase}/images/logo.png`} />
          <span>视频监控</span>
        </div>
      </div>

    </div>
  );
};

export default Home;
