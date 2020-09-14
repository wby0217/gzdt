const { override, overrideDevServer, fixBabelImports, addLessLoader } = require('customize-cra');
const path = require('path');

const setWebpackOutput = () => (config) => {
  config.output = {
    ...config.output,
    library: 'datahub-admin-console',
    libraryTarget: 'umd',
    publicPath: process.env.REACT_APP_USER_WEB_URL,
    jsonpFunction: 'webpackJsonp_datahub-admin-console',
  };
  return config;
};

// 以下这种写法是不对的！！！
// webpackConfig.output = {
//   ...webpackConfig.output,
//   library: 'datahub-admin-console',
//   libraryTarget: 'umd',
//   publicPath: `//localhost:3009/`,
//   jsonpFunction: 'webpackJsonp_datahub-admin-console',
// };

// console.log(webpackConfig);

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@hack': `true; @import "assets/styles/myCustomizedAntdTheme.less";`,
      },
      paths: [path.resolve(__dirname, 'src')],
    }),
    setWebpackOutput() // 这才是正解，如果报错，只能说是 publicPath 有问题，因为如果你设置了 %publicUrl%，你需要加上publicUrl
  ),
  devServer: (configFunc) => {
    return (proxy, allowedHost) => {
      const config = configFunc(proxy, allowedHost);
      config.headers = config.headers || {};
      config.headers = {
        ...config.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      };
      // config.historyApiFallback = true;
      // config.port = 3009;
      // config.hot = false;
      // config.watchContentBase = false;
      // config.liveReload = false;
      return config;
    };
  },
};