"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const suzume_babel_config_1 = __importDefault(require("../../vendor/babel-config.js"));
const getConfigProcessor_1 = __importDefault(require("../scripts/utils/getConfigProcessor"));
let config = suzume_babel_config_1.default;
const processor = (0, getConfigProcessor_1.default)('babel');
if (processor) {
    config = processor(config) || config;
}
exports.default = config;
