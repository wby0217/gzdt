import React, { useState, useEffect } from "react";
import "./RiskList.scss";

interface Props {

}

const RiskList: { (props: Props): JSX.Element } = (props) => {
    return (
        <div
            className="RiskList"
        >
            <div className="risk-text">
                <p className="red-text">I级</p>
                <p className="org-text">II级</p>
                <p className="yel-text">III级</p>
                <p className="blu-text">IV级</p>
            </div>
            <div className="color-box">
                <div className="line-box">
                    <div className="jt-title">集团级</div>
                    <div className="red-box">3</div>
                    <div className="org-box">38</div>
                    <div className="yel-box"></div>
                    <div className="blu-box"></div>
                </div>
                <div className="line-box">
                    <div className="zb-title">总部级</div>
                    <div className="red-box">3</div>
                    <div className="org-box">38</div>
                    <div className="yel-box"></div>
                    <div className="blu-box"></div>
                </div>
                <div className="line-box">
                    <div className="jg-title">监管部级</div>
                    <div className="red-box">3</div>
                    <div className="org-box">38</div>
                    <div className="yel-box"></div>
                    <div className="blu-box"></div>
                </div>
            </div>
        </div>
    );
};

export default RiskList;
