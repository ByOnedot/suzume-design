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
const gulp_1 = __importDefault(require('gulp'));
const fs_extra_1 = __importDefault(require('fs-extra'));
const gulp_replace_1 = __importDefault(require('gulp-replace'));
const suzume_dev_utils_1 = require('../../../../vendor/dev-utils');
const compileTS_1 = __importDefault(require('./compileTS'));
const compileStyle_1 = require('./compileStyle');
const icon_1 = __importDefault(require('../icon'));
const component_1 = __importDefault(require('../../../config/webpack/component'));
const webpackWithPromise_1 = __importDefault(require('../../utils/webpackWithPromise'));
const constant_1 = require('../../../constant');
const DIR_PATH_ESM = `${constant_1.CWD}/${constant_1.DIR_NAME_ESM}`;
const DIR_PATH_CJS = `${constant_1.CWD}/${constant_1.DIR_NAME_CJS}`;
const watchES = () => {
  return (0, compileTS_1.default)({ outDir: DIR_PATH_ESM, type: 'es', watch: true });
};
const buildES = () => {
  return (0, compileTS_1.default)({ outDir: DIR_PATH_ESM, type: 'es' });
};
const buildCJS = () => {
  return (0, compileTS_1.default)({
    outDir: DIR_PATH_CJS,
    type: 'cjs',
  }).then(() => {
    return new Promise((resolve, reject) => {
      gulp_1.default
        .src(`${DIR_PATH_CJS}/**/*.js`, { allowEmpty: true })
        .pipe((0, gulp_replace_1.default)('/icon/react-icon/', '/icon/react-icon-cjs/'))
        .pipe(gulp_1.default.dest(DIR_PATH_CJS))
        .on('end', resolve)
        .on('error', reject);
    });
  });
};
const buildUMD = () => {
  suzume_dev_utils_1.print.info('[suzume-build]', 'Start to build dist module...');
  return (0, webpackWithPromise_1.default)(component_1.default).then(
    () => suzume_dev_utils_1.print.success('[suzume-build]', 'Build dist module success!'),
    (error) => {
      throw error;
    }
  );
};
const buildCSS = () => {
  suzume_dev_utils_1.print.info('[suzume-build]', 'Start to build css...');
  return (0, compileStyle_1.build)().then(
    () => suzume_dev_utils_1.print.success('[suzume-build]', 'Build css success!'),
    (error) => {
      throw error;
    }
  );
};
exports.default = {
  buildCSS,
  buildES,
  buildCJS,
  buildUMD,
  build: () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // Remove old files
      [DIR_PATH_ESM, DIR_PATH_CJS, component_1.default.output.path].forEach(
        (path) => path && fs_extra_1.default.removeSync(path)
      );
      try {
        yield buildES();
        yield Promise.all([buildCJS(), buildUMD(), (0, icon_1.default)()]);
        yield buildCSS();
      } catch (error) {
        suzume_dev_utils_1.print.error('[suzume-build]', 'Failed to build component');
        console.error(error);
        process.exit(1);
      }
    }),
  dev: () => {
    watchES();
    (0, compileStyle_1.watch)();
  },
};
