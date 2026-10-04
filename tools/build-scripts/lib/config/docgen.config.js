"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCGEN_LANGUAGE_PLACEHOLDER_IN_FILENAME = void 0;
const constant_1 = require("../constant");
const getConfigProcessor_1 = __importDefault(require("../scripts/utils/getConfigProcessor"));
/**
 * Language placeholder in file name configuration
 */
exports.DOCGEN_LANGUAGE_PLACEHOLDER_IN_FILENAME = '[language]';
let config = {
    template: 'TEMPLATE.md',
    entry: `${constant_1.DIR_NAME_COMPONENT_LIBRARY}/*`,
    output: '',
    outputFileName: constant_1.FILENAME_README,
    demoGlob: `${constant_1.DIR_NAME_DEMO}/*.{jsx,tsx}`,
    tsParseTool: ['react-docgen-typescript', {}],
    languages: ['zh-CN'],
};
const processor = (0, getConfigProcessor_1.default)('docgen');
if (processor) {
    config = processor(config) || config;
}
exports.default = config;
