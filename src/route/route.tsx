import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// 首页
import Home from '../pages/Home/Home';
// 数字工地
import ConstructionSite from '../pages/ConstructionSite/ConstructionSite';
// 监控视频
import VideoMonitor from '../pages/VideoMonitor/VideoMonitor';

const RouterList: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/constructionSite" component={ConstructionSite}></Route>
            <Route exact path="/videoMonitor" component={VideoMonitor}></Route>
        </Switch>
    );
};

export default RouterList;
