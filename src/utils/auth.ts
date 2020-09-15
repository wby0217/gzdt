import VConsole from 'vconsole';
import { apiServices } from "../services";
import { isDev } from './core';

/**
 * 真机测试环境需要打开VConsole方便调试
 */
export function isShowConsole() {
    if (isDev) {
        new VConsole();
    }
}
