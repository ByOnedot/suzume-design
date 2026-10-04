"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNode = exports.testClient = void 0;
const jest_1 = require("jest");
const config_1 = __importDefault(require("../config/jest/config"));
const testClient = () => {
    const argv = process.argv.slice(3);
    const cliConfig = ['--silent'].concat(argv);
    return (0, jest_1.run)(['--config', JSON.stringify(config_1.default.client), ...cliConfig]);
};
exports.testClient = testClient;
const testNode = () => {
    const argv = process.argv.slice(3);
    const cliConfig = ['--silent'].concat(argv);
    return (0, jest_1.run)(['--config', JSON.stringify(config_1.default.node), ...cliConfig]);
};
exports.testNode = testNode;
