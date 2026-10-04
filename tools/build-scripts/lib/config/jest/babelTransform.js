"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_jest_1 = __importDefault(require("babel-jest"));
const babel_config_1 = __importDefault(require("../babel.config"));
module.exports = babel_jest_1.default.createTransformer(Object.assign(Object.assign({}, babel_config_1.default), { babelrc: false, configFile: false }));
