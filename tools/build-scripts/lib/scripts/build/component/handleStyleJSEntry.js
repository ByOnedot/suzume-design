'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * In order to solve the problem of on-demand loading of style files, less|css entry file is generated in the /style folder
 * Corresponding to /style/index.js | /style/css.js respectively
 */
const path_1 = __importDefault(require('path'));
const gulp_1 = __importDefault(require('gulp'));
const glob_1 = __importDefault(require('glob'));
const fs_extra_1 = __importDefault(require('fs-extra'));
const vinyl_fs_1 = __importDefault(require('vinyl-fs'));
const through2_1 = __importDefault(require('through2'));
const gulp_rename_1 = __importDefault(require('gulp-rename'));
const gulp_replace_1 = __importDefault(require('gulp-replace'));
const merge_stream_1 = __importDefault(require('merge-stream'));
const suzume_dev_utils_1 = require('../../../../vendor/dev-utils');
const style_config_1 = __importDefault(require('../../../config/style.config'));
const parsePackageImports_1 = __importDefault(require('../../utils/parsePackageImports'));
const constant_1 = require('../../../constant');
const { css: cssConfig, jsEntry: jsEntryConfig } = style_config_1.default;
const dependenciesCacheMap = {};
/**
 * Get the GlobPattern of the component directory
 */
function getComponentDirPattern(dirName) {
  const pathDir = `${constant_1.CWD}/${dirName.length > 1 ? `{${dirName.join(',')}}` : dirName[0]}`;
  let pattern = pathDir;
  if (
    glob_1.default.sync(
      path_1.default.resolve(pathDir, `*/style/${constant_1.FILENAME_STYLE_ENTRY_RAW}`)
    ).length
  ) {
    pattern = path_1.default.resolve(pathDir, './*');
  }
  return pattern;
}
/**
 * Generate /style/css.js
 */
function compileCssJsEntry({ styleJSEntry, outDirES, outDirCJS }) {
  return __awaiter(this, void 0, void 0, function* () {
    const compile = (module) => {
      return new Promise((resolve, reject) => {
        (0, merge_stream_1.default)(
          styleJSEntry.map((entry) =>
            gulp_1.default.src(entry, {
              allowEmpty: true,
              base: entry.replace(/(\/\*{1,2})*\/style\/index\.[jt]s$/, ''),
            })
          )
        )
          .pipe((0, gulp_replace_1.default)(`.${jsEntryConfig.styleSheetExtension}`, '.css'))
          .pipe(
            // import './index.css' => import './index.css'
            // import '../es/Button/style' => import '../es/Button/style/css.js'
            (0, gulp_replace_1.default)(
              /import\s+'(.+(?:\/style)?)(?:\/index.[jt]s)?'/g,
              (_, $1) => {
                const suffix = $1.endsWith('/style') ? '/css.js' : '';
                return module === 'es' ? `import '${$1}${suffix}'` : `require('${$1}${suffix}')`;
              }
            )
          )
          .pipe(
            (0, gulp_rename_1.default)(function (path) {
              const [basename, extname] = constant_1.FILENAME_STYLE_ENTRY_CSS.split('.');
              path.basename = basename;
              path.extname = `.${extname}`;
            })
          )
          .pipe(gulp_1.default.dest(module === 'es' ? outDirES : outDirCJS))
          .on('end', resolve)
          .on('error', reject);
      });
    };
    if (Array.isArray(styleJSEntry) && styleJSEntry.length) {
      try {
        const asyncTasks = [];
        if (fs_extra_1.default.pathExistsSync(outDirES)) {
          asyncTasks.push(compile('es'));
        }
        if (fs_extra_1.default.pathExistsSync(outDirCJS)) {
          asyncTasks.push(compile('cjs'));
        }
        yield Promise.all(asyncTasks);
      } catch (error) {
        suzume_dev_utils_1.print.error(
          '[suzume-build]',
          `Failed to build ${constant_1.FILENAME_STYLE_ENTRY_CSS}`
        );
        console.error(error);
      }
    }
  });
}
/**
 * Automatically inject the style reference of the dependent Suzume component into the style entry file
 * e.g. import '@suzume-design/web-react/es/Button/style/index.js'
 */
function transformStyleEntryContent({ esEntryPath, module }) {
  return __awaiter(this, void 0, void 0, function* () {
    const replaceStyleEntryContent = (type) =>
      __awaiter(this, void 0, void 0, function* () {
        const moduleDirName = module === 'es' ? constant_1.DIR_NAME_ESM : constant_1.DIR_NAME_CJS;
        const styleEntryFileName =
          type === jsEntryConfig.styleSheetExtension
            ? constant_1.FILENAME_STYLE_ENTRY_RAW
            : constant_1.FILENAME_STYLE_ENTRY_CSS;
        const styleEntryPath = path_1.default
          .resolve(path_1.default.dirname(esEntryPath), `./style/${styleEntryFileName}`)
          .replace('/es/', `/${moduleDirName}/`);
        if (fs_extra_1.default.pathExistsSync(styleEntryPath)) {
          let styleIndexContent = fs_extra_1.default.readFileSync(styleEntryPath, 'utf8');
          if (!dependenciesCacheMap[esEntryPath]) {
            dependenciesCacheMap[esEntryPath] = yield (0, parsePackageImports_1.default)(
              esEntryPath,
              constant_1.SUZUME_LIBRARY_PACKAGE_NAME_REACT
            );
          }
          dependenciesCacheMap[esEntryPath].forEach((dep) => {
            const depStyleRequirePath = `${constant_1.SUZUME_LIBRARY_PACKAGE_NAME_REACT}/${moduleDirName}/${dep}/style/${styleEntryFileName}`;
            if (styleIndexContent.indexOf(depStyleRequirePath) === -1) {
              const expression =
                module === 'es'
                  ? `import '${depStyleRequirePath}';\n`
                  : `require('${depStyleRequirePath}');\n`;
              styleIndexContent = `${expression}${styleIndexContent}`;
            }
          });
          fs_extra_1.default.writeFileSync(styleEntryPath, styleIndexContent);
        }
      });
    yield Promise.all([
      replaceStyleEntryContent(jsEntryConfig.styleSheetExtension),
      replaceStyleEntryContent('css'),
    ]);
  });
}
function injectSuzumeDepStyle(componentEsDirPattern) {
  return new Promise((resolve) => {
    const esEntry = path_1.default.resolve(componentEsDirPattern, 'index.js');
    if (!fs_extra_1.default.existsSync(esEntry)) {
      resolve(null);
      return;
    }
    vinyl_fs_1.default
      .src(esEntry, {
        allowEmpty: true,
        base: componentEsDirPattern,
      })
      .pipe(
        through2_1.default.obj((file, _, cb) =>
          __awaiter(this, void 0, void 0, function* () {
            try {
              yield Promise.all([
                transformStyleEntryContent({
                  esEntryPath: file.path,
                  module: 'es',
                }),
                transformStyleEntryContent({
                  esEntryPath: file.path,
                  module: 'cjs',
                }),
              ]);
            } catch (error) {
              suzume_dev_utils_1.print.error(
                '[suzume-build]',
                `Failed to inject suzume dependencies style to ${file.path}`
              );
              console.error(error);
            }
            cb(null);
            resolve(null);
          })
        )
      );
  });
}
function renameStyleEntryFilename() {
  const { cssEntryFileName, rawEntryFileName } = jsEntryConfig;
  if (cssEntryFileName || rawEntryFileName) {
    glob_1.default
      .sync(getComponentDirPattern([constant_1.DIR_NAME_ESM, constant_1.DIR_NAME_CJS]))
      .forEach((dirPath) => {
        const random = `${Math.random().toFixed(5)}`;
        const styleDirPath = `${dirPath}/style`;
        const cssEntryPath = {
          prev: path_1.default.resolve(styleDirPath, constant_1.FILENAME_STYLE_ENTRY_CSS),
          temp: path_1.default.resolve(styleDirPath, `css.${random}.js`),
          next: path_1.default.resolve(styleDirPath, cssEntryFileName),
        };
        const rawEntryPath = {
          prev: path_1.default.resolve(styleDirPath, constant_1.FILENAME_STYLE_ENTRY_RAW),
          temp: path_1.default.resolve(styleDirPath, `${random}.js`),
          next: path_1.default.resolve(styleDirPath, rawEntryFileName),
        };
        const needRenameCssEntry =
          cssEntryFileName && fs_extra_1.default.existsSync(cssEntryPath.prev);
        const needRenameLessEntry =
          rawEntryFileName && fs_extra_1.default.existsSync(rawEntryPath.prev);
        if (needRenameCssEntry) {
          fs_extra_1.default.renameSync(cssEntryPath.prev, cssEntryPath.temp);
        }
        if (needRenameLessEntry) {
          fs_extra_1.default.renameSync(rawEntryPath.prev, rawEntryPath.temp);
        }
        if (needRenameCssEntry) {
          fs_extra_1.default.renameSync(cssEntryPath.temp, cssEntryPath.next);
        }
        if (needRenameLessEntry) {
          fs_extra_1.default.renameSync(rawEntryPath.temp, rawEntryPath.next);
        }
      });
  }
}
function handleStyleJSEntry() {
  return __awaiter(this, void 0, void 0, function* () {
    yield compileCssJsEntry({
      styleJSEntry: jsEntryConfig.entry,
      outDirES: cssConfig.output.es,
      outDirCJS: cssConfig.output.cjs,
    });
    if (jsEntryConfig.autoInjectSuzumeDep) {
      yield injectSuzumeDepStyle(getComponentDirPattern([constant_1.DIR_NAME_ESM]));
    }
    renameStyleEntryFilename();
  });
}
exports.default = handleStyleJSEntry;
