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

export const AdminConsole_Routes = [
    {
        menuItem: true,
        iconClass: "codepen",
        name: "域列表",
        path: "/",
        exact: true,
        permissions: {
            systemAdmin: true,
            anonymousUser: false,
            domainRoles: [],
        },
        // eslint-disable-next-line no-undef
        component: '',
    },
    {
        menuItem: true,
        iconClass: "codepen",
        name: "域列表",
        path: "/admin-console",
        exact: true,
        permissions: {
            systemAdmin: true,
            anonymousUser: false,
            domainRoles: [],
        },
        // eslint-disable-next-line no-undef
        component: '',
    }
];
