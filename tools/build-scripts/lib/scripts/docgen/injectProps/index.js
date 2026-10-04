"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withReactDocgen_1 = __importDefault(require("./withReactDocgen"));
const withTsDocument_1 = __importDefault(require("./withTsDocument"));
const docgen_config_1 = __importDefault(require("../../../config/docgen.config"));
function injectProps(options) {
    const [tool, toolOptions] = docgen_config_1.default.tsParseTool;
    const { markdownBody, placeholder } = options;
    if (markdownBody.indexOf(placeholder) === -1) {
        return markdownBody;
    }
    if (tool === 'ts-document') {
        return (0, withTsDocument_1.default)(options, toolOptions);
    }
    return (0, withReactDocgen_1.default)(options);
}
exports.default = injectProps;
