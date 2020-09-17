import React, { useState, useEffect } from "react";
import "./TitleBar.scss";
import { resourceBase } from '../../utils/core';
import { Icon } from "antd-mobile";

interface Props {
    title: string;
    imgName: string;
    imgWidth?: number;
}

const TitleBar: { (props: Props): JSX.Element } = (props) => {
    console.log('props', props);
    return (
        <div className="TitleBar">
            <div className="right">
                <img
                    style={{
                        width: props.imgWidth || '30px',
                        height: props.imgWidth || '30px'
                    }}
                    src={`${resourceBase}/images/${props.imgName}.png`}
                />
                <p>{props.title}</p>
            </div>
            {/* <Icon type="right" /> */}
        </div>
    );
};

export default TitleBar;
