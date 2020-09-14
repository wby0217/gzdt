/*
 * @Author: bianhui
 * @Date: 2019-04-22 10:17:10
 * @Last Modified by: bianhui
 * @Last Modified time: 2019-04-25 09:17:47
 * request 拦截器
 * 可以全局拦截请求参数
 */
import { Toast } from 'antd-mobile';
import { reject } from 'q';
let temp = 0;
let loading: any;
let timeoutMessage: any;
export function req(params = {}, res: any) {
  // 开启loading
  if (temp === 0) {
    // loading = message.loading('加载中');
  }
  temp++;
  return params;
}

/**
 * response 拦截器
 *
 */
export function res(res: any) {
  console.log("resopnse---------", res);
  temp--;
  // 最后一个接口返回时清除loading
  if (temp === 0) {
    // loading && loading();
  }
  if (res === "Timeout to fetch") {
    timeoutMessage = Toast.info('请求超时，请重新尝试');
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(false);
  }
  if (res.message) {
    timeoutMessage && timeoutMessage();
    timeoutMessage = Toast.info('网络连接失败，请重新尝试');
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(false);
  }
  // 超时处理
  if (res === "Timeout to fetch") {
    timeoutMessage && timeoutMessage();
    timeoutMessage = Toast.info('请求超时，请重新尝试');
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(false);
  } else if (res && res !== "Timeout to fetch") {
    return Promise.resolve(res.data);
  } else {
    console.log(res);
    timeoutMessage && timeoutMessage();
    timeoutMessage = Toast.info('网络连接失败，请重新尝试');
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(false);
  }
  // return Promise.resolve(res)
}
