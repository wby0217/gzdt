import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { isShowConsole } from './utils/auth';
import 'antd-mobile/dist/antd-mobile.css';

// 打开vconsole
isShowConsole();

function render(props: any) {
  ReactDOM.render(
    <BrowserRouter>
      <App {...props} />
    </BrowserRouter>,
    document.querySelector('#root')
  );
}

render({});
