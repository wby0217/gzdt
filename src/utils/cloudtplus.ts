import { isLocalhost } from './core';
console.log('isLocalhost', isLocalhost);
declare const window: any;
export const isCloudtplus = !isLocalhost && window.cloudtplus && window.cloudtplus.onDeviceReady;
export function onDeviceReady(cb: { (): void }) {
    window.cloudtplus.onDeviceReady(cb && cb());
}
// 获取上下文用户信息 产品名称 租户 关联云token
export function cloudtplus(fnName: string, res: { (data): void }, rej: { (error): void }, params?: Object) {
    console.log(JSON.stringify(params));
    if (isCloudtplus) {
        window.cloudtplus.onDeviceReady(() => {
            window.cloudtplus[fnName]({
                success: (data) => res && res(data),
                error: (error) => rej && rej(error),
                ...params
            });
        });
    }
}

export function uploadOfflineFilesToOSS(successCB, errorCB, progressCB, files) {
    // 上传OfflineFile
    window.cloudtplus.uploadOfflineFile({
        success: successCB,
        error: errorCB,
        progress: progressCB,
        items: files
    });
}

export async function getContextInfo() {
    return new Promise((resolve, reject) => {
        window.cloudtplus.getContextInfo({
            success: (data) => {
                resolve(data);
            },
            error: (e) => {
                reject(e);
            },
        });
    });
}
