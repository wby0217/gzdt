import React, { useState, useEffect } from "react";
import "./SituationBox.scss";
import { resourceBase } from '../../utils/core';
import { Icon } from "antd-mobile";
import TitleBar from '../TitleBar/TitleBar';

interface Props {
    children?: JSX.Element;
    title: string;
    imgName: string;
}

const SituationBox: { (props: Props): JSX.Element } = (props) => {
    console.log('props', props);
    return (
        <div className="SituationBox">
            <div className="TitleBar-wrap">
                <TitleBar
                    title={props.title}
                    imgName={props.imgName}
                />
            </div>
            {/* <div className="title-box">
                <div className="right">
                    <img src={`${resourceBase}/images/${props.imgName}.png`} />
                    <p>{props.title}</p>
                </div>
                <Icon type="right" />
            </div> */}
            {
                props.children
            }
        </div>
    );
};

export default SituationBox;
