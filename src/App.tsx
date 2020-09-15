import React, { Component, useState, useEffect, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch, useLocation } from 'react-router-dom';
import { useGlobalUserStore, GlobalUserInfo, UserRole } from './store/useGlobalUserStore';

import './App.scss';
import RouterList from './route/route';

const App = (props: any) => {
  const { globalUser, updateGlobalUser } = useGlobalUserStore();

  useEffect(() => {

  }, []);

  return (
    <Router basename="/gzdt-mobile/">
      <RouterList />
    </Router>
  );
};

export default App;
