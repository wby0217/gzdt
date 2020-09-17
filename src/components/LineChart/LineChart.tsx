import React, { useState, useEffect } from "react";
import "./LineChart.scss";
import ReactEcharts from 'echarts-for-react';

interface Props {
    xAxisData: any;
    seriesData: any;
    lineColor?: string;
    startColor?: string;
    stopColor?: string;
    lineHeight?: number;
    lineWidth?: number;
    grid?: any;
    areaStyle?: boolean;
    rotate?: any;
    symbol?: boolean;
    series?: any;
}

const LineChart: { (props: Props): JSX.Element } = (props) => {
    const { xAxisData, seriesData, lineColor, startColor, stopColor, areaStyle = null, series, symbol, rotate, lineHeight, grid, lineWidth } = props;
    const option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            show: true, //不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
            axisTick: {
                show: false //不显示坐标轴刻度线
            },
            axisLine: {
                show: false, //不显示坐标轴线
            },
            // axisLabel: axisLabel || {}
            axisLabel: {
                // show: false, //不显示坐标轴上的文字
                interval: 0, //横轴信息全部显示
                rotate: rotate || 0, //60度角倾斜显示
            }
        },
        yAxis: {
            show: false,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                console.log(params, ticket, callback);
                return '<div>12345</div>';
            }
            // axisPointer: {
            //     type: 'cross',
            //     label: {
            //         backgroundColor: '#6a7985'
            //     }
            // }
        },
        grid: grid || {
            left: '0%',
            bottom: '0%',
            top: '0%',
            right: '0%',
            containLabel: false
        },
        series: series || [{
            data: seriesData,
            type: 'line',
            symbol: symbol ? 'block' : 'none', // 取消折点圆圈
            name: '邮件营销',
            itemStyle: {
                normal: {
                    color: "#0068F9",
                    lineStyle: {
                        color: lineColor || '#0068F9' //折线颜色
                    }
                }
           },
            areaStyle: areaStyle ? {
                normal: {
                    color: {
                        type: 'linear', //设置线性渐变
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: startColor || '#0068F9' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: stopColor || '#D1E4FD' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                }
            } : null,
        }]
    };

    return (
        <div className="LineChart">
            <ReactEcharts option={option} style={{ width: lineWidth, height: lineHeight || 'calc(100vw / 5.6)' }} />
        </div>
    );
};

export default LineChart;
