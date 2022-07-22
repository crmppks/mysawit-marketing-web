const CracoLess   = require("craco-less");
const CracoAlias  = require("craco-alias");

module.exports = {
    style: {
      postOptions: {
        plugins: [
          // require('postcss-import'),
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    plugins: [
      {
        plugin: CracoLess,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {
                '@primary-color': '#00a149',
                '@border-radius-base': '0.25rem',
                '@label-color': '#888888',
                '@form-vertical-label-padding': '0 0 0 0',
                '@form-item-margin-bottom': '10px',
                '@form-item-label-font-size': '14px'
              },
              javascriptEnabled: true,
            },
          },
        },
      },
      {
        plugin: CracoAlias,
        options: {
           source: "tsconfig",
           // baseUrl SHOULD be specified
           // plugin does not take it from tsconfig
           baseUrl: "./src",
           /* tsConfigPath should point to the file where "baseUrl" and "paths" 
           are specified*/
           tsConfigPath: "./tsconfig.paths.json"
        }
     }
    ],
};