const path = require('path');
var prod = process.env.NODE_ENV === 'production';
const PluginUglifyjs = require('@wepy/plugin-uglifyjs');
module.exports = {
    wpyExt: '.wpy',
    eslint: true,
    cliLogs: !prod,
    static: ['src/assets'],
    build: {},
    resolve: {
        alias: {
            counter: path.join(__dirname, 'src/components/counter'),
            '@': path.join(__dirname, 'src')
        },
        aliasFields: ['wepy', 'weapp', 'browser'],
        modules: ['node_modules']
    },
    compilers: {
        less: {
            compress: prod
        },
        babel: {
            sourceMap: true,
            presets: [
                '@babel/preset-env'
            ],
            plugins: [
                '@wepy/babel-plugin-import-regenerator',
                "@babel/plugin-proposal-class-properties"
            ]
        }
    },
    plugins: [
        PluginUglifyjs({
            // options
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log'] // 移除console
            }
        })
    ],
    appConfig: {
        noPromiseAPI: ['createSelectorQuery']
    }
}