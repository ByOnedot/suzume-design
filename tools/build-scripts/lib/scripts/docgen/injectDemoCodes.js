"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const doctrine_1 = __importDefault(require("doctrine"));
const parse_es_import_1 = __importDefault(require("parse-es-import"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
function parseRawComment(fileContent) {
    const commentList = [];
    fileContent.replace(/\/\*{2}\s*\n(\s*\*.*\n)+\s*\*\//g, (match) => {
        const comment = {
            kind: 'member',
        };
        doctrine_1.default
            .parse(match, { unwrap: true, recoverable: true })
            .tags.forEach(({ title, name, description }) => {
            const value = name || description;
            if (value) {
                comment[title] = value;
            }
            if (title === 'file') {
                comment.kind = 'file';
            }
        });
        commentList.push(comment);
    });
    return commentList;
}
function injectDemoCodes({ demoEntries, markdownBody, placeholder, }) {
    if (markdownBody.indexOf(placeholder) === -1) {
        return markdownBody;
    }
    // Single entry
    if (demoEntries.length === 1 && demoEntries[0].endsWith('js')) {
        const entryPoint = demoEntries[0];
        const entryContent = fs_extra_1.default.readFileSync(entryPoint, 'utf8');
        // Get demo source code
        const demoInfoList = [];
        const { exports } = (0, parse_es_import_1.default)(entryContent);
        const getDemoInfo = (moduleName) => {
            const [requirePath] = (0, suzume_dev_utils_1.getRealRequirePath)(moduleName, entryPoint);
            if (requirePath) {
                return {
                    content: fs_extra_1.default.readFileSync(requirePath, 'utf8'),
                    isTS: !!requirePath.match(/.tsx?$/),
                };
            }
            return null;
        };
        exports.forEach(({ type, moduleName, value }) => {
            switch (type) {
                case 'ExportSpecifier':
                    const demoInfo = getDemoInfo(value);
                    demoInfo && demoInfoList.push(demoInfo);
                    break;
                case 'FunctionDeclaration':
                    demoInfoList.push({
                        content: value,
                        isTS: false,
                    });
                    break;
                case 'VariableDeclaration':
                    demoInfoList.push({
                        content: `const ${moduleName} = ${value}`,
                        isTS: false,
                    });
                    break;
                default:
                    break;
            }
        });
        // Get comment
        const commentList = parseRawComment(entryContent);
        const commentStr = `\n~~~json type=description\n${JSON.stringify(commentList, null, 2)}\n~~~\n`;
        const demoStr = demoInfoList
            .map(({ content, isTS }) => `\n~~~${isTS ? 't' : 'j'}sx\n${content}\n~~~\n`)
            .join('');
        return markdownBody.replace(placeholder, `${commentStr}${demoStr}`);
    }
    const demos = demoEntries.map((path) => {
        const fileExt = path.split('.').pop();
        const fileContent = fs_extra_1.default.readFileSync(path, 'utf8');
        return `\n~~~${fileExt}\n${fileContent}\n~~~\n`;
    });
    return markdownBody.replace(placeholder, demos.join(''));
}
exports.default = injectDemoCodes;
