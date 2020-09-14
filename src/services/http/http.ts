import { promises } from "fs";
import { reject, resolve } from "q";
const qs = require('qs');

/**
 * 模拟异步服务，例如 HTTP 或者其他 Websocket 等
 */
class Request {
    _header = {
        'X-API-Token': '',
        'content-type': 'application/x-www-form-urlencoded'
    };
    interceptors = {
        req: Object,
        res: Object
    };
    time = 20000;
    constructor() {}

    request(params: object) {
        let { url, method, data } = this.interceptors.req ? this.interceptors.req(params) : params;
        let requestOption = {
            method,
        };
        let requestUrl = '';
        if (method === 'GET') {
            requestUrl = `${url}?${qs.stringify(data)}`;
        } else {
            requestUrl = url;
            let body = {
                body: qs.stringify(data)
            };
            requestOption = { ...requestOption, ...body };
        }
        let result = {
            status: 0,
            statusText: '',
            data: ''
        };
        return fetch(requestUrl, requestOption)
            .then((res) => {
                /* res原生结构
                body: ReadableStream
                bodyUsed: true
                headers: Headers {}
                ok: true
                redirected: false
                status: 200
                statusText: "OK"
                type: "basic"
                url: "http://localhost:3000/deviceId.json?"
                */
                result.status = res.status;
                result.statusText = res.statusText;
                console.log(res);
                return res && res.json();
            })
            .then((json) => {
                return resolve({ ...result, data: json });
            })
            .catch((err: any) => {
                console.log('err--', err);
                return reject(err);
            });
    }
    timeOut(time: number) {
        return new Promise((_resolve, reject) => {
            setTimeout(() => {
                // eslint-disable-next-line prefer-promise-reject-errors
                return reject('Timeout to fetch');
            }, time);
        });
    }
    async get(url: string, data: any, header: any) {
        return await Promise.race([this.request({ url, method: 'GET', header, data }), this.timeOut(this.time)]).then((resolve) => {
            return this.interceptors.res ? this.interceptors.res(resolve) : resolve;
        }).catch((err) => {
            return this.interceptors.res ? this.interceptors.res(err) : err;
        });
    }
    post(url: string, data = {}, header = {}) {
        return Promise.race([this.request({ url, method: 'POST', header, data }), this.timeOut(this.time)]);
    }
    setInterceptors(request: any, response: any) {
        if (typeof request === 'function') {
            this.interceptors.req = request;
        }
        if (typeof request === 'function') {
            this.interceptors.res = response;
        }
        return this;
    }
}

export default new Request();
