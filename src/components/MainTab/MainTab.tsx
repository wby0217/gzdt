import React, { useState, useEffect } from "react";
import "./MainTab.scss";
import { resourceBase } from '../../utils/core';
import { Link } from "react-router-dom";

interface Props {
    index: number
}

const MainTab: { (props: Props): JSX.Element } = (props) => {
    const btnData = [
        {
            name: '概况',
            imgName: 'situation',
            router: '/'
        },
        {
            name: '数字工地',
            imgName: 'constructionSite',
            router: '/constructionSite'
        },
        {
            name: '视频监控',
            imgName: 'videoMonitor',
            router: '/videoMonitor'
        }
    ];

    return (
        <div className="MainTab">
            {
                btnData.map((item, i) => (
                    <Link
                        className={`button ${props.index === i ? 'changeBtn' : ''}`}
                        key={i}
                        to={item.router}
                    >
                        <img src={`${resourceBase}/images/${item.imgName}${props.index === i ? '-select' : ''}.png`} />
                        <span>{item.name}</span>
                    </Link>
                ))
            }
            {/* <div
                className={`button ${count === 0 ? 'changeBtn' : ''}`}
                onClick={() => switchPanel(0)}
            >
                <img src={`${resourceBase}/images/logo.png`} />
                <span>概况</span>
            </div>
            <div
                className={`button ${count === 1 ? 'changeBtn' : ''}`}
                onClick={() => switchPanel(1)}
            >
                <img src={`${resourceBase}/images/logo.png`} />
                <span>数字工地</span>
            </div>
            <div
                className={`button ${count === 2 ? 'changeBtn' : ''}`}
                onClick={() => switchPanel(2)}
            >
                <img src={`${resourceBase}/images/logo.png`} />
                <span>视频监控</span>
            </div> */}
        </div>
    );
};

export default MainTab;
