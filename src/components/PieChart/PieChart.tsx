import React, { useState, useEffect } from "react";
import ReactEcharts from 'echarts-for-react';
import "./PieChart.scss";

interface Props {
    itemData: any;
    colorList: any;
    radius?: any;
    showNameList?: boolean;
    pieWidth?: number;
}

const PieChart: { (props: Props): JSX.Element } = (props) => {
    const {
        itemData,
        colorList,
        showNameList = true,
        radius,
        pieWidth
    } = props;
    const clientWidth = document.documentElement.clientWidth;
    const option = {
        legend: {
            bottom: 10,
            left: 'center',
        },
        color: colorList,
        series: [
            {
                hoverAnimation: false,
                type: 'pie',
                radius: radius || '100%',
                center: ['50%', '50%'],
                data: itemData,
                label: {
                    normal: {
                        show: false
                    }
                }
            }
        ]
    };

    return (
        <div className="PieChart">
            <ReactEcharts option={option} style={{ width: pieWidth || (clientWidth / 5.9), height: pieWidth || (clientWidth / 5.9) }} />
            {
                showNameList &&
                <div className="pie-list-wrap">
                    <div className="list-item">
                        <i></i>
                        <p className="list-item-name">未贯通</p>
                        <p className="list-item-num">4</p>
                    </div>
                    <div className="list-item">
                        <i></i>
                        <p className="list-item-name">未贯通</p>
                        <p className="list-item-num">4</p>
                    </div>
                    <div className="list-item">
                        <i></i>
                        <p className="list-item-name">未贯通</p>
                        <p className="list-item-num">4</p>
                    </div>
                    <div className="list-item">
                        <i></i>
                        <p className="list-item-name">未贯通哈</p>
                        <p className="list-item-num">43</p>
                    </div>
                </div>
            }
        </div>
    );
};

export default PieChart;
