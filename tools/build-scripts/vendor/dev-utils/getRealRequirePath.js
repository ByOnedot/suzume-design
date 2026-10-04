"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * Get real file path of the referenced JS module
 * @param requirePath Original require path
 * @param requireFrom Which directory to resolve from
 */
function getRealRequirePath(requirePath, requireFrom = process.cwd()) {
    const validTails = [
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '/index.js',
        '/index.ts',
        '/index.jsx',
        '/index.tsx',
    ];
    try {
        if (!fs_extra_1.default.lstatSync(requireFrom).isDirectory()) {
            requireFrom = path_1.default.dirname(requireFrom);
        }
    }
    catch (e) { }
    return glob_1.default.sync(path_1.default.resolve(requireFrom, requirePath.match(/.[jt]sx?$/) ? requirePath : `${requirePath}{${validTails.join(',')}}`));
}
exports.default = getRealRequirePath;
