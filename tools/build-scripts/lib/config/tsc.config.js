"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getConfigProcessor_1 = __importDefault(require("../scripts/utils/getConfigProcessor"));
let config = {};
const processor = (0, getConfigProcessor_1.default)('tsc');
if (processor) {
    config = processor(config) || config;
}
exports.default = config;
