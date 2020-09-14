import { trim } from 'lodash';

export const REACT_APP_ENV = trim(process.env.REACT_APP_ENV);
console.log(REACT_APP_ENV);
export const isProd = REACT_APP_ENV === 'production';
export const isDev = REACT_APP_ENV === 'development';
export const isLocalhost = REACT_APP_ENV === 'local' || !REACT_APP_ENV;

export const REACT_APPAPI_GATEWAY = process.env.REACT_APP_API_GATEWAY_ENDPOINT;
export const REACT_APPAPI_GATALOG = process.env.REACT_APP_API_GATALOG_ENDPOINT;
export const REACT_APP_USER_WEB_URL = process.env.REACT_APP_USER_WEB_URL;
export const resourceBase = process.env.PUBLIC_URL;

console.log(process.env);

if (!isProd) {
  // console.log('env', REACT_APP_ENV);
}
