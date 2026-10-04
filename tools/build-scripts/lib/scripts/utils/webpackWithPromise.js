"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
exports.default = (config, callback) => {
    return new Promise((resolve, reject) => {
        (0, webpack_1.default)(config, (err, stats) => {
            callback && callback(err, stats);
            if (err) {
                console.error(err.stack || err);
                reject();
                return;
            }
            (0, suzume_dev_utils_1.print)(stats.toString({
                assets: true,
                colors: true,
                warnings: true,
                errors: true,
                errorDetails: true,
                entrypoints: true,
                version: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                children: false,
            }));
            if (stats.hasErrors()) {
                reject();
            }
            else {
                resolve(null);
            }
        });
    });
};
