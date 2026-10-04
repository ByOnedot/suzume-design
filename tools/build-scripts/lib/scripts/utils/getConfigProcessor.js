"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
const constant_1 = require("../../constant");
function getConfigProcessor(configType) {
    const configFilePath = `${constant_1.CWD}/.config/${configType}.config.js`;
    let processor = null;
    if (fs_extra_1.default.existsSync(configFilePath)) {
        try {
            processor = require(configFilePath);
        }
        catch (error) {
            suzume_dev_utils_1.print.error('[suzume-build]', `Failed to extend configuration from ${configFilePath}`);
            console.error(error);
            process.exit(1);
        }
    }
    return processor;
}
exports.default = getConfigProcessor;
