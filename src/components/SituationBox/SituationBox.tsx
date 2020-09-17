import React, { useState, useEffect } from "react";
import "./SituationBox.scss";
import { resourceBase } from '../../utils/core';
import { Icon } from "antd-mobile";
import TitleBar from '../TitleBar/TitleBar';

interface Props {
    children?: JSX.Element;
    title: string;
    imgName: string;
    style?: any;
}

const SituationBox: { (props: Props): JSX.Element } = (props) => {
    const { children, imgName, title, style } = props;
    return (
        <div
            className="SituationBox"
            style={{ ...style }}
        >
            <div className="TitleBar-wrap">
                <TitleBar
                    title={title}
                    imgName={imgName}
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
                children
            }
        </div>
    );
};

export default SituationBox;
