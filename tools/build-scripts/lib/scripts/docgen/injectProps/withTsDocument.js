"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ts_document_1 = require("ts-document");
const suzume_dev_utils_1 = require("../../../../vendor/dev-utils");
const docgen_config_1 = __importDefault(require("../../../config/docgen.config"));
const LANGUAGE_TRANSFER_MAP = {
    'zh-CN': 'zh',
    'en-US': 'en',
};
function withTsDocument({ markdownBody, attributes, currentDir, placeholder, language }, toolOptions) {
    const parseFiles = attributes.file ? attributes.file.split(',') : [];
    let propsTables = [];
    parseFiles.forEach((file) => {
        const [entryFilePath] = (0, suzume_dev_utils_1.getRealRequirePath)(file, currentDir);
        if (entryFilePath) {
            const markdownSchema = (0, ts_document_1.generateMarkdown)(entryFilePath, Object.assign({ lang: LANGUAGE_TRANSFER_MAP[language], sourceFilesPaths: path_1.default.resolve(docgen_config_1.default.entry, '**/*.{ts,tsx}') }, toolOptions));
            if (markdownSchema) {
                propsTables = propsTables.concat(Object.entries(markdownSchema).map(([, ms]) => ms));
            }
        }
    });
    if (!propsTables.length) {
        suzume_dev_utils_1.print.warn(['suzume-build'], `No API document was parsed in ${currentDir}`);
    }
    return markdownBody.replace(placeholder, propsTables.length ? propsTables.join('\n\n') : '');
}
exports.default = withTsDocument;
