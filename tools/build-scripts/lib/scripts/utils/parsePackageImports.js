"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const parse_es_import_1 = __importDefault(require("parse-es-import"));
const suzume_dev_utils_1 = require("../../../vendor/dev-utils");
/**
 * Resolve all dependencies of an ES module for a package
 */
function parsePackageImports(entryPath, packageName, result = [], parsedFileMap = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let entryFileContent = '';
        try {
            entryFileContent = fs_extra_1.default.readFileSync(entryPath, 'utf8');
        }
        catch (error) { }
        const { imports } = yield (0, parse_es_import_1.default)(entryFileContent);
        parsedFileMap[entryPath] = true;
        yield Promise.all([...imports].map(({ namedImports, moduleName }) => __awaiter(this, void 0, void 0, function* () {
            if (moduleName === packageName) {
                namedImports.forEach(({ name }) => {
                    if (result.indexOf(name) === -1) {
                        result.push(name);
                    }
                });
                return;
            }
            if (moduleName.match(/^\.{1,2}\//)) {
                const [requirePath] = (0, suzume_dev_utils_1.getRealRequirePath)(moduleName, entryPath);
                if (requirePath && !parsedFileMap[requirePath]) {
                    yield parsePackageImports(requirePath, packageName, result, parsedFileMap);
                }
            }
        })));
        return result;
    });
}
exports.default = parsePackageImports;
