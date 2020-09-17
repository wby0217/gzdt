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
import SwitchBtn from '../../components/SwitchBtn/SwitchBtn';
import PieChart from '../../components/PieChart/PieChart';
import echarts from 'echarts/lib/echarts';
//导入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import TitleBar from "../../components/TitleBar/TitleBar";
import RiskList from "../../components/RiskList/RiskList";

interface Props {}

const Home: { (props: Props): JSX.Element } = (props) => {
  const clientWidth = document.documentElement.clientWidth;
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
            data: [100, 200, 150, 300, 200, 120, 500]
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
              <p className="center-bottom">（本年）</p>
            </div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box green">
            <p className="box-title">施工工点</p>
            <div className="box-center">8</div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box red">
            <p className="box-title">施工工点</p>
            <div className="box-center">8</div>
            <p className="box-tip">正在施工</p>
          </div>
          <div className="num-box purple">
            <p className="box-title">施工工点</p>
            <div className="box-center">
              <p>8</p>
              <p className="center-bottom">（红色+橙色）</p>
            </div>
            <p className="box-tip">正在施工</p>
          </div>
        </div>

        <div className="num-box-wrap">
          <div className="num-box blue span-01">
            <p className="text">现场/在岗人数</p>
            <p className="num">2928/3789</p>
          </div>
          <div className="num-box blue span-02">
            <p className="text">在岗人数</p>
            <p className="num">2928</p>
          </div>
          <div className="num-box blue span-02">
            <p className="text">在岗人数</p>
            <p className="num">2928</p>
          </div>
          <div className="num-box blue span-03">
            <p className="text">在岗人数</p>
            <p className="num">2928</p>
          </div>
        </div>

        {/*
          * 进度情况
        */}
        <SituationBox
          title="人员情况"
          imgName="logo"
        >
          <>
            <div className="num-bar">
              <div>
                <span className="text-span">总数</span>
                <span className="num-span">56</span>
              </div>
              <div>
                <span className="text-span">已开工</span>
                <span className="num-span">16</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
              }}
            >
              <div className="pie-box">
                <TitleBar
                  title="站点"
                  imgWidth={25}
                  imgName="logo"
                />
                <PieChart
                  itemData={
                    [
                      { value: 548 },
                      { value: 535 },
                      { value: 510 },
                      { value: 634 },
                    ]
                  }
                  colorList={
                    ['#1777FD', '#F9A825', '#E91E63', '#00BCD4']
                  }
                />
              </div>
              <div className="pie-box">
                <TitleBar
                  title="区间"
                  imgWidth={25}
                  imgName="logo"
                />
                <PieChart
                  itemData={
                    [
                      { value: 548 },
                      { value: 535 },
                      { value: 510 },
                      { value: 634 },
                    ]
                  }
                  colorList={
                    ['#1777FD', '#F9A825', '#E91E63', '#00BCD4']
                  }
                />
              </div>
            </div>
          </>
        </SituationBox>

        {/*
          * 进度情况
        */}
        <SituationBox
          title="进度情况"
          imgName="logo"
          styles={{
            paddingBottom: 16
          }}
        >
          <>
            <div
              className="personnel-pie-wrap"
              style={{
                display: 'flex',

              }}
            >
              <div
                className="personnel-pie"
              >
                <PieChart
                  itemData={
                    [
                      { value: 698 },
                      { value: 1000 }
                    ]
                  }
                  colorList={
                    ['#F9A825', '#D8D8D8']
                  }
                  pieWidth={clientWidth / 3.2}
                  radius={['80%', '100%']}
                  showNameList={false}
                />
                <div className="pie-center-num">
                  <div className="pie-center-num-top">
                    <span
                      className="num"
                      style={{ color: '#0068F9' }}
                    >100</span>
                    <span className="proportion">%</span>
                  </div>
                  <p className="pie-center-text">投资完成率</p>
                </div>
              </div>
              <div
                className="personnel-pie"
              >
                <PieChart
                  itemData={
                    [
                      { value: 548 },
                      { value: 1000 }
                    ]
                  }
                  colorList={
                    ['#1777FD', '#D8D8D8']
                  }
                  radius={['80%', '100%']}
                  pieWidth={clientWidth / 3.2}
                  showNameList={false}
                />
                <div className="pie-center-num">
                  <div className="pie-center-num-top">
                    <span
                      className="num"
                      style={{ color: '#F9A825' }}
                    >100</span>
                    <span className="proportion">%</span>
                  </div>
                  <p className="pie-center-text">投资完成率</p>
                </div>
              </div>
            </div>
            <SwitchBtn
              onClick={(id) => {
                console.log(id);
              }}
              btnData={[
                {
                  id: 1,
                  name: '本年',
                  width: 78
                },
                {
                  id: 2,
                  name: '累计',
                  width: 78
                }
              ]}
            />
          </>
        </SituationBox>

        {/*
          * 机械分布情况
        */}
        <SituationBox
          title="机械分布情况"
          imgName="logo"
        >
          <>
            <PieChart
              nameListClass="pie-list-wrap-flex"
              styles={{
                paddingTop: 12
              }}
              itemData={
                [
                  { value: 548 },
                  { value: 535 },
                  { value: 510 },
                  { value: 634 },
                ]
              }
              colorList={
                ['#1777FD', '#F9A825', '#E91E63', '#00BCD4']
              }
              pieWidth={clientWidth / 2.7}
              longitudinal
            />
            <div className="machine-wrap">
              <div className="machine-wrap-content">
                <img className="machine-icon" src={`${resourceBase}/images/logo.png`} />
                <div className="machine-right-data">
                  <div className="machine-title">联机数<span>56</span></div>
                  <div className="machine-data-bar">
                    <div>
                      <p>23</p>
                      <p>掘进中</p>
                    </div>
                    <div>
                      <p>23</p>
                      <p>掘进中</p>
                    </div>
                    <div>
                      <p>23</p>
                      <p>掘进中</p>
                    </div>
                    <div>
                      <p>23</p>
                      <p>掘进中</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </SituationBox>

        {/*
          * 风险管控情况
        */}
        <SituationBox
          title="风险管控情况"
          imgName="logo"
          styles={{
            paddingBottom: 24
          }}
        >
          <>
            <RiskList />
            <SwitchBtn
              onClick={(id) => {
                console.log(id);
              }}
              btnData={[
                {
                  id: 1,
                  name: '当期',
                  width: 78
                },
                {
                  id: 2,
                  name: '本年合计',
                  width: 78
                },
                {
                  id: 3,
                  name: '累计',
                  width: 78
                }
              ]}
            />
          </>
        </SituationBox>

        {/*
          * 报警情况
        */}
        <SituationBox
          title="报警情况"
          imgName="logo"
          styles={{
            paddingBottom: 24
          }}
        >
          <>
            <div
              style={{
                position: 'relative'
              }}
            >
              <PieChart
                styles={{
                  padding: '33px 17px 25px'
                }}
                pieWidth={clientWidth / 2.7}
                itemData={
                  [
                    { value: 548 },
                    { value: 535 },
                    { value: 510 },
                    { value: 634 },
                  ]
                }
                radius={['70%', '100%']}
                colorList={
                  ['#D0021B', '#F9A825', '#F8E71C', '#1777FD']
                }
                nameListClass="pie-list-wrap-police"
              />
              <div
                className="center-data"
                style={{
                  width: clientWidth / 2.7,
                  height: clientWidth / 2.7
                }}
              >
                <p>234</p>
                <p>报警总数</p>
              </div>
            </div>
            <SwitchBtn
              onClick={(id) => {
                console.log(id);
              }}
              btnData={[
                {
                  id: 1,
                  name: '今天',
                  width: 78
                },
                {
                  id: 2,
                  name: '最近7天',
                  width: 78
                },
                {
                  id: 3,
                  name: '累计',
                  width: 78
                }
              ]}
            />
          </>
        </SituationBox>
      </div>

      <MainTab index={0} />

    </div>
  );
};

export default Home;
