"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// markdown processor
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const template_1 = __importDefault(require("@babel/template"));
const core_1 = require("@babel/core");
const babel_config_1 = __importDefault(require("../babel.config"));
babel_config_1.default.plugins = [...babel_config_1.default.plugins];
babel_config_1.default.plugins.push(createDemoPlugin);
// Create Demo export
function createDemoPlugin({ types }) {
    return {
        visitor: {
            Program(path) {
                const importReact = (0, template_1.default)('import React from "react";import ReactDOM from "react-dom";');
                path.unshiftContainer('body', importReact());
            },
            CallExpression(path) {
                if (path.node.callee.object &&
                    path.node.callee.object.name === 'ReactDOM' &&
                    path.node.callee.property.name === 'render') {
                    const app = types.VariableDeclaration('const', [
                        types.VariableDeclarator(types.Identifier('__export'), path.node.arguments[0]),
                    ]);
                    const exportDefault = types.ExportDefaultDeclaration(types.Identifier('__export'));
                    path.insertAfter(exportDefault);
                    path.insertAfter(app);
                    path.remove();
                }
            },
        },
    };
}
// get code block
const codeRegex = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/m;
module.exports = {
    process(src) {
        const str = codeRegex.exec(src);
        if (str !== null && (str[3] === 'js' || str[3] === 'javascript' || str[3] === 'tsx')) {
            let config = babel_config_1.default;
            if (str[3] === 'tsx') {
                config = Object.assign(Object.assign({}, config), { plugins: [
                        ...config.plugins,
                        ['@babel/plugin-transform-typescript', { isTSX: true }],
                    ] });
            }
            return (0, core_1.transform)(str[4], config).code;
        }
    },
    getCacheKey(fileData, filename, configString, { instrument, rootDir }) {
        return crypto_1.default
            .createHash('md5')
            .update('\0', 'utf8')
            .update(fileData)
            .update('\0', 'utf8')
            .update(path_1.default.relative(rootDir, filename))
            .update('\0', 'utf8')
            .update(configString)
            .update('\0', 'utf8')
            .update(instrument ? 'instrument' : '')
            .update('\0', 'utf8')
            .update(process.env.NODE_ENV || '')
            .update('\0', 'utf8')
            .update(process.env.BABEL_ENV || '')
            .digest('hex');
    },
};
