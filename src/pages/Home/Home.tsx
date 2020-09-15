import React, { useState, useEffect } from "react";
import "./Home.scss";
import { cloudtplus } from '../../utils/cloudtplus';
import GeneralSituation from '../GeneralSituation/GeneralSituation';
import ConstructionSite from '../ConstructionSite/ConstructionSite';
import VideoMonitor from '../VideoMonitor/VideoMonitor';
import { useGlobalUserStore, GlobalUserInfo, UserRole } from '../../store/useGlobalUserStore';
import { resourceBase } from '../../utils/core';
import MainTab from '../../components/MainTab/MainTab';
import SituationBox from '../../components/SituationBox/SituationBox';
import echarts from 'echarts/lib/echarts';
//导入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';

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

  const getOption = () => {
    let option = {
        title: {
          text: '用户骑行订单'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '订单量',
            type: 'bar',
            data: [1000, 2000, 1500, 3000, 2000, 1200, 900]
          }
        ]
    };
    return option;
  };

  return (
    <div className="Home">
      {/* {
        setContent(count)
      } */}

      <div className="main-content">
        {/* <ReactEcharts option={getOption()} style={{ height: '400px' }} /> */}
        <div className="num-box-wrap">
          <div className="num-box blue">
            <p className="box-title">施工工点</p>
            <div className="box-center">
              <p>8</p>
              <p>（本年）</p>
            </div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box blue">
            <p className="box-title">施工工点</p>
            <div className="box-center">8</div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box blue">
            <p className="box-title">施工工点</p>
            <div className="box-center">8</div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box blue">
            <p className="box-title">施工工点</p>
            <div className="box-center">8</div>
            <p className="box-tip">正在施工</p>
          </div>
        </div>

        <div className="num-box-wrap">
          <div className="num-box blue span-01">
            <p>现场/在岗人数</p>
            <p>2928/3789</p>
          </div>
          <div className="num-box blue span-02">
            <p>在岗人数</p>
            <p>2928</p>
          </div>
          <div className="num-box blue span-02">
            <p>在岗人数</p>
            <p>2928</p>
          </div>
          <div className="num-box blue span-03">
            <p>在岗人数</p>
            <p>2928</p>
          </div>
        </div>

        <SituationBox
          title="人员情况"
          imgName="logo"
        >
          <ReactEcharts option={getOption()} style={{ height: '400px' }} />
        </SituationBox>
      </div>

      <MainTab index={0} />
      {/* <div className="btn-wrap">
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
      </div> */}

    </div>
  );
};

export default Home;
