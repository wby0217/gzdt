import axios from 'axios';
import { Toast } from 'antd-mobile';
import * as config from "./config";
import { res } from './interceptor';
const Qs = require('qs');
const root = config.GLODON_API_URL;
// eslint-disable-next-line no-new-object
const Request: any = new Object();
const instance = axios.create({
    baseURL: root,
    timeout: 20000
    // transformRequest: [function (data) {

    //   data = Qs.stringify(data);
    //   return data;
    // }],
    // withCredentials: true //加了这段就可以跨域了
});
// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    });
// 添加响应拦截器
instance.interceptors.response.use((response) => {
    // 对响应数据做点什么
    if (response.status === 204) {
        return response;
    } else {
        return response.data;
    }
}, (error) => {
    console.log(error.response);
    if (error.response) {
        switch (error.response.status) {
            case 404:
                Toast.info('接口地址错误， 请确认');
                break;
            default:
                return error.response;
        }
    } else {
        Toast.info('网络连接失败，请稍后再试');
    }
});
Request.request = (method: any, params: any) => {
    console.log(...params);
    return instance({
        method: method,
        ...params
    }).catch((error) => {
        console.log(error);
    });
};
Request.get = (url: any, params: any = {}) => {
    return instance.get(url, {
        params: params
    }).catch((error) => {

    });
};
Request.post = (url: any, params: any = {}) => {
    return instance({
        method: 'post',
        url: url,
        data: params
    }).catch((error) => {
        console.log(error);
    });
};
Request.put = (url: any, params: any = {}) => {
    return instance({
        method: 'put',
        url: url,
        data: params
    });
};
Request.delete = (url: any) => {
    return instance({
        method: 'delete',
        url: url,
    });
};
export default Request;
