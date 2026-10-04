"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const progress_bar_webpack_plugin_1 = __importDefault(require("progress-bar-webpack-plugin"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
const constant_1 = require("../../constant");
const getConfigProcessor_1 = __importDefault(require("../../scripts/utils/getConfigProcessor"));
const { name: packageName, version } = require(`${constant_1.CWD}/package.json`);
const packageNameWithoutScope = packageName.replace(/^@[^\/]+\//, '');
let config = {
    entry: `${constant_1.CWD}/${constant_1.DIR_NAME_ICON}/index.js`,
    output: {
        path: `${constant_1.CWD}/${constant_1.DIR_NAME_UMD}`,
        filename: 'suzume-icon.min.js',
        library: 'suzumeicon',
        libraryTarget: 'umd',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/,
            },
        ],
    },
    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
        suzume_dev_utils_1.webpackExternalForSuzume,
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new progress_bar_webpack_plugin_1.default({
            format: `[suzume-build]: [:bar] ${chalk_1.default.green.bold(':percent')} (:elapsed seconds)`,
        }),
        new webpack_1.default.BannerPlugin({
            banner: `${packageNameWithoutScope} v${version}\n\nCopyright (c) 2019-present Bytedance, Inc. and its affiliates.\nCopyright (c) 2026 Suzume Design.\n\nMIT License - see LICENSE for details.\n`,
        }),
    ],
};
const processor = (0, getConfigProcessor_1.default)('webpack');
const realProcessor = processor && processor.icon;
if (realProcessor) {
    config = realProcessor(config) || config;
}
exports.default = config;
