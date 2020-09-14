import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// 首页
import Home from '../pages/Home/Home';

const RouterList: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home}></Route>
        </Switch>
    );
};

export default RouterList;
