"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const progress_bar_webpack_plugin_1 = __importDefault(require("progress-bar-webpack-plugin"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
const tsc_config_1 = __importDefault(require("../tsc.config"));
const babel_config_1 = __importDefault(require("../babel.config"));
const constant_1 = require("../../constant");
const getConfigProcessor_1 = __importDefault(require("../../scripts/utils/getConfigProcessor"));
const { name: packageName, version } = require(`${constant_1.CWD}/package.json`);
const packageNameWithoutScope = packageName.replace(/^@[^\/]+\//, '');
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
function getUse(cssModule) {
    const options = cssModule
        ? {
            modules: {
                localIdentName: '[local]-[hash:10]',
            },
        }
        : {};
    return [
        {
            loader: require.resolve('style-loader'),
        },
        {
            loader: require.resolve('css-loader'),
            options,
        },
        {
            loader: require.resolve('less-loader'),
            options: {
                javascriptEnabled: true,
            },
        },
    ];
}
function getTSLoaderOptions() {
    const options = {
        // Just for simplicity, not all the values in tscConfig are compilerOptions
        compilerOptions: Object.assign({}, tsc_config_1.default),
        // The UMD bundle only needs the emit, not a second type-check: the
        // legacy webpack toolchain pins TypeScript 4.6, which cannot evaluate
        // the React 19 JSX runtime types and crashes inside the checker.
        // Type safety is enforced by `pnpm typecheck` (modern TypeScript) and
        // by the es/cjs builds, which run before this step.
        transpileOnly: true,
    };
    const configFile = tsc_config_1.default.project || `${constant_1.CWD}/tsconfig.json`;
    if (require('fs').existsSync(configFile)) {
        options.configFile = configFile;
    }
    return options;
}
let config = {
    mode: 'production',
    entry: {
        suzume: `${constant_1.CWD}/${constant_1.DIR_NAME_COMPONENT_LIBRARY}/index.tsx`,
    },
    output: {
        path: `${constant_1.CWD}/${constant_1.DIR_NAME_UMD}`,
        publicPath: `https://unpkg.com/${packageName}@latest/${constant_1.DIR_NAME_UMD}/`,
        filename: '[name].min.js',
        library: '[name]',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babel_config_1.default,
                    },
                    {
                        loader: require.resolve('ts-loader'),
                        options: getTSLoaderOptions(),
                    },
                ],
            },
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: getUse(false),
            },
            {
                test: /\.css$/,
                sideEffects: true,
                use: [
                    {
                        loader: require.resolve('style-loader'),
                    },
                    {
                        loader: require.resolve('css-loader'),
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2)$/,
                loader: require.resolve('file-loader'),
                options: {
                    esModule: false,
                },
            },
            {
                test: /\.svg$/,
                use: [require.resolve('@svgr/webpack')],
            },
            {
                test: lessModuleRegex,
                use: getUse(true),
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
    resolveLoader: {
        modules: ['node_modules'],
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
// When webpack.config.js directly exposes a function, it defaults to the configuration of component webpack
const realProcessor = typeof processor === 'function'
    ? processor
    : processor && processor.component
        ? processor.component
        : null;
if (realProcessor) {
    config = realProcessor(config) || config;
}
// Compatible, avoid the outer layer directly set the entry as a string
if (typeof config.entry === 'string') {
    config.entry = {
        suzume: config.entry,
    };
}
// 通过 Node Env 传递而来的参数具有最高优先级
if (constant_1.BUILD_ENV_MODE) {
    config.mode = constant_1.BUILD_ENV_MODE;
}
if (constant_1.BUILD_ENV_DIST_FILENAME_JS) {
    config.output.filename = constant_1.BUILD_ENV_DIST_FILENAME_JS;
}
exports.default = config;
