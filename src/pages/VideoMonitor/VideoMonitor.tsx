import React, { useState, useEffect } from "react";
import "./VideoMonitor.scss";
import MainTab from '../../components/MainTab/MainTab';
import { List, Checkbox, Flex } from 'antd-mobile';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

interface Props {}

const VideoMonitor: { (props: Props): JSX.Element } = (props) => {
  const data = [
    { value: 0, label: 'Ph.D.' },
    { value: 1, label: 'Bachelor' },
    { value: 2, label: 'College diploma' },
  ];

  const onChange = (val) => {
    console.log(val);
  };

  return (
    <div className="VideoMonitor">
      <div className="main-content">
        <div>
          <List renderHeader={() => 'CheckboxItem demo'}>
            {data.map((i) => (
              <CheckboxItem key={i.value} onChange={() => onChange(i.value)}>
                {i.label}
              </CheckboxItem>
            ))}
          </List>
        </div>
      </div>

      <MainTab index={2} />
    </div>
  );
};

export default VideoMonitor;
