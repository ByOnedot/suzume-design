"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_less_1 = __importDefault(require("gulp-less"));
const less_plugin_autoprefix_1 = __importDefault(require("less-plugin-autoprefix"));
const less_plugin_npm_import_1 = __importDefault(require("less-plugin-npm-import"));
const constant_1 = require("../constant");
const getConfigProcessor_1 = __importDefault(require("../scripts/utils/getConfigProcessor"));
const compatiblePropertyNameChange_1 = __importDefault(require("../scripts/utils/compatiblePropertyNameChange"));
const npmImport = new less_plugin_npm_import_1.default({ prefix: '~' });
const autoprefix = new less_plugin_autoprefix_1.default();
const FILE_ASSET_EXT = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'eot', 'woff', 'woff2'];
const FILE_WATCHED_EXT = FILE_ASSET_EXT.concat(['less', 'css']);
let config = {
    css: {
        entry: [`${constant_1.DIR_NAME_SOURCE}/**/index.less`, `${constant_1.DIR_NAME_COMPONENT_LIBRARY}/**/index.less`],
        watch: [
            `${constant_1.DIR_NAME_SOURCE}/**/*.{${FILE_WATCHED_EXT.join(',')}}`,
            `${constant_1.DIR_NAME_COMPONENT_LIBRARY}/**/*.{${FILE_WATCHED_EXT.join(',')}}`,
        ],
        watchBase: {},
        output: {
            es: constant_1.DIR_NAME_ESM,
            cjs: constant_1.DIR_NAME_CJS,
            dist: {
                path: `${constant_1.DIR_NAME_UMD}/css`,
                cssFileName: constant_1.FILENAME_DIST_CSS,
                rawFileName: constant_1.FILENAME_DIST_LESS,
            },
        },
        compiler: gulp_less_1.default,
        compilerOptions: {
            paths: ['node_modules'],
            plugins: [npmImport, autoprefix],
            relativeUrls: true,
            javascriptEnabled: true,
        },
    },
    asset: {
        entry: [
            `${constant_1.DIR_NAME_SOURCE}/**/*.{${FILE_ASSET_EXT.join(',')}}`,
            `${constant_1.DIR_NAME_COMPONENT_LIBRARY}/**/*.{${FILE_ASSET_EXT.join(',')}}`,
        ],
        output: `${constant_1.DIR_NAME_UMD}/${constant_1.DIR_NAME_ASSET}`,
    },
    jsEntry: {
        entry: [`${constant_1.DIR_NAME_SOURCE}/style/index.ts`, `${constant_1.DIR_NAME_COMPONENT_LIBRARY}/*/style/index.ts`],
        autoInjectSuzumeDep: true,
        styleSheetExtension: 'less',
        rawEntryFileName: '',
        cssEntryFileName: '',
    },
    hook: {},
};
// Compatible 'config.less' field changed to 'config.css'
config = (0, compatiblePropertyNameChange_1.default)(config, [{ now: 'css', prev: 'less' }]);
const processor = (0, getConfigProcessor_1.default)('style');
if (processor) {
    config = processor(config) || config;
}
// Options passed through Node Env have the highest priority
if (constant_1.BUILD_ENV_DIST_FILENAME_CSS) {
    config.css.output.dist.cssFileName = constant_1.BUILD_ENV_DIST_FILENAME_CSS;
}
exports.default = config;
