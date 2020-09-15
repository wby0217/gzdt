import React, { useState, useEffect } from "react";
import { List, Checkbox, Flex } from 'antd-mobile';
import "./GeneralSituation.scss";

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

interface Props {}

const GeneralSituation: { (props: Props): JSX.Element } = (props) => {
  // useEffect(() => {

  // });

  const data = [
    { value: 0, label: 'Ph.D.' },
    { value: 1, label: 'Bachelor' },
    { value: 2, label: 'College diploma' },
  ];

  const onChange = (val) => {
    console.log(val);
  };

  return (
    <div className="GeneralSituation">
      首页
      {/* <div>
        <List renderHeader={() => 'CheckboxItem demo'}>
          {data.map((i) => (
            <CheckboxItem key={i.value} onChange={() => onChange(i.value)}>
              {i.label}
            </CheckboxItem>
          ))}
        </List>
      </div> */}
    </div>
  );
};

export default GeneralSituation;
