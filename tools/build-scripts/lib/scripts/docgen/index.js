"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const front_matter_1 = __importDefault(require("front-matter"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
const injectProps_1 = __importDefault(require("./injectProps"));
const injectDemoCodes_1 = __importDefault(require("./injectDemoCodes"));
const constant_1 = require("../../constant");
const docgen_config_1 = __importStar(require("../../config/docgen.config"));
const PLACEHOLDER_PROP = '%%Props%%';
const PLACEHOLDER_DEMO = '%%Demos%%';
/**
 * Check if config is valid
 */
function preCheck() {
    if (!docgen_config_1.default.languages.length) {
        suzume_dev_utils_1.print.error('[suzume-build]', 'Please specify at least one target language');
        return false;
    }
    if (!docgen_config_1.default.tsParseTool) {
        suzume_dev_utils_1.print.error('[suzume-build]', 'Please specify the tool to generate doc by TS type');
        return false;
    }
    if (docgen_config_1.default.tsParseTool[0] === 'react-docgen-typescript') {
        suzume_dev_utils_1.print.warn('[suzume-build]', 'react-docgen-typescript will be removed in the next major version, please consider using ts-document for document extraction');
    }
}
function getFilenameLanguageMap() {
    const templateFilenameLanguageMap = {};
    const outputFilenameLanguageMap = {};
    docgen_config_1.default.languages.forEach((lang) => {
        templateFilenameLanguageMap[lang] = docgen_config_1.default.template.replace(docgen_config_1.DOCGEN_LANGUAGE_PLACEHOLDER_IN_FILENAME, lang);
        outputFilenameLanguageMap[lang] = docgen_config_1.default.outputFileName.replace(docgen_config_1.DOCGEN_LANGUAGE_PLACEHOLDER_IN_FILENAME, lang);
    });
    return [templateFilenameLanguageMap, outputFilenameLanguageMap];
}
exports.default = (components) => {
    if (preCheck() === false) {
        return;
    }
    const [templateFilenameMap, outputFilenameMap] = getFilenameLanguageMap();
    // Filter out components that can be automatically generated
    const componentDirs = glob_1.default.sync(docgen_config_1.default.entry).filter((dir) => {
        try {
            if (fs_extra_1.default.lstatSync(dir).isDirectory()) {
                // Not within the component parameter specified by the user
                if (components && components.indexOf(dir.match(/[^\/]+$/g)[0]) === -1) {
                    return false;
                }
                // No template file found
                let hasTemplateFile = false;
                for (const lang in templateFilenameMap) {
                    if (fs_extra_1.default.existsSync(path_1.default.resolve(dir, templateFilenameMap[lang]))) {
                        hasTemplateFile = true;
                        break;
                    }
                }
                if (!hasTemplateFile) {
                    !dir.endsWith('/style') &&
                        suzume_dev_utils_1.print.error('[suzume-build]', `Template for docgen ${dir} not found`);
                    return false;
                }
                return true;
            }
        }
        catch (e) { }
        return false;
    });
    if (!componentDirs.length) {
        suzume_dev_utils_1.print.warn('[suzume-build]', 'No valid entry for doc generate');
        return;
    }
    suzume_dev_utils_1.print.info('[suzume-build]', 'Start to generate document...');
    componentDirs.forEach((dir) => {
        const replacePlaceholder = (language) => {
            const templateFilename = templateFilenameMap[language];
            const outputFilename = outputFilenameMap[language];
            const templatePath = path_1.default.resolve(dir, templateFilename);
            if (!fs_extra_1.default.existsSync(templatePath)) {
                suzume_dev_utils_1.print.error('[suzume-build]', `Template ${templatePath} not found`);
            }
            const fmResult = (0, front_matter_1.default)(fs_extra_1.default.readFileSync(templatePath, 'utf8'));
            const attributes = fmResult.attributes;
            let markdownBody = fmResult.body;
            // Inject Props doc
            markdownBody = (0, injectProps_1.default)({
                currentDir: dir,
                attributes,
                markdownBody,
                placeholder: PLACEHOLDER_PROP,
                language,
            });
            // Inject Demos
            const demoEntries = glob_1.default.sync(path_1.default.resolve(dir, docgen_config_1.default.demoGlob));
            markdownBody = (0, injectDemoCodes_1.default)({ demoEntries, markdownBody, placeholder: PLACEHOLDER_DEMO });
            fs_extra_1.default.outputFileSync(docgen_config_1.default.output || path_1.default.resolve(dir, outputFilename), markdownBody);
        };
        docgen_config_1.default.languages.forEach(replacePlaceholder);
        suzume_dev_utils_1.print.success('[suzume-build]', `${chalk_1.default.black.bgGreen.bold(`Generate API for ${path_1.default.relative(constant_1.CWD, dir)} Success!`)}`);
    });
};
