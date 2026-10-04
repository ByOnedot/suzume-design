"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealRequirePath = exports.webpackExternalForSuzume = exports.print = void 0;
const print_1 = require("./print");
Object.defineProperty(exports, "print", { enumerable: true, get: function () { return print_1.default; } });
const webpack_external_1 = require("./webpack-external");
Object.defineProperty(exports, "webpackExternalForSuzume", { enumerable: true, get: function () { return webpack_external_1.default; } });
const getRealRequirePath_1 = require("./getRealRequirePath");
Object.defineProperty(exports, "getRealRequirePath", { enumerable: true, get: function () { return getRealRequirePath_1.default; } });
