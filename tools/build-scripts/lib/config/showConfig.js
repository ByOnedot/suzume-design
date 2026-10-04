"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const suzume_dev_utils_1 = require("../../vendor/dev-utils");
/**
 * Print current config for suzume-build
 */
exports.default = (type) => {
    let configPath = '';
    switch (type) {
        case 'babel':
            configPath = path_1.default.resolve(__dirname, './babel.config');
            break;
        case 'style':
            configPath = path_1.default.resolve(__dirname, './style.config');
            break;
        case 'webpack.component':
            configPath = path_1.default.resolve(__dirname, './webpack/component');
            break;
        case 'webpack.site':
            configPath = path_1.default.resolve(__dirname, './webpack/site');
            break;
        case 'webpack.icon':
            configPath = path_1.default.resolve(__dirname, './webpack/icon');
            break;
        case 'jest':
            configPath = path_1.default.resolve(__dirname, './jest/config');
            break;
        case 'docgen':
            configPath = path_1.default.resolve(__dirname, './docgen.config');
            break;
        default:
            suzume_dev_utils_1.print.error('Invalid parameter: configType. It should be one of [babel|style|webpack.component|webpack.site|webpack.icon|jest|docgen]');
            return;
    }
    (0, suzume_dev_utils_1.print)(require(configPath));
    (0, suzume_dev_utils_1.print)('\n');
    suzume_dev_utils_1.print.success(`For more details, view [${configPath}]`);
};
