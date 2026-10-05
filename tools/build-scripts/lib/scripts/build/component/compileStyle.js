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
exports.build = exports.watch = void 0;
const fs_extra_1 = __importDefault(require('fs-extra'));
const path_1 = __importDefault(require('path'));
const glob_1 = __importDefault(require('glob'));
const chokidar_1 = __importDefault(require('chokidar'));
const gulp_1 = __importDefault(require('gulp'));
const gulp_if_1 = __importDefault(require('gulp-if'));
const gulp_rename_1 = __importDefault(require('gulp-rename'));
const gulp_replace_1 = __importDefault(require('gulp-replace'));
const gulp_clean_css_1 = __importDefault(require('gulp-clean-css'));
const merge_stream_1 = __importDefault(require('merge-stream'));
const suzume_dev_utils_1 = require('../../../../vendor/dev-utils');
const through2_1 = __importDefault(require('through2'));
const handleStyleJSEntry_1 = __importDefault(require('./handleStyleJSEntry'));
const style_config_1 = __importDefault(require('../../../config/style.config'));
const constant_1 = require('../../../constant');
const { css: cssConfig, asset: assetConfig, hook = {} } = style_config_1.default;
// Output less compilation errors, and avoid the program from exiting due to errors
const notifyLessCompileResult = (stream) => {
  let hasError = false;
  return stream
    .on('error', function (error) {
      hasError = true;
      suzume_dev_utils_1.print.error('[suzume-build]', 'Failed to update style');
      console.error(error);
      this.emit('end');
    })
    .on('end', () => {
      !hasError &&
        suzume_dev_utils_1.print.info(
          '[suzume-build]',
          `Style updated at ${new Date().toLocaleString()}`
        );
    });
};
const handleAdditionalData = (file, _, cb) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const originalContents = file.contents.toString();
      const { data, append, overwrite } =
        typeof cssConfig.additionalData === 'function'
          ? yield cssConfig.additionalData({
              path: file.path,
              contents: originalContents,
            })
          : cssConfig.additionalData;
      file.contents = Buffer.from(
        overwrite ? data : append ? `${originalContents}\n${data}` : `${data}\n${originalContents}`
      );
    } catch (error) {
      suzume_dev_utils_1.print.error(
        '[suzume-build]',
        `Failed to append/prepend additional data to ${file.path}`
      );
    }
    cb(null, file);
  });
// Copy the files that need to be monitored to the es/lib directory
function copyFileWatched() {
  const patternArray = cssConfig.watch;
  const destDirs = [cssConfig.output.es, cssConfig.output.cjs].filter((path) => !!path);
  if (destDirs.length) {
    // Path of style build entries
    const rawStyleEntries = [];
    cssConfig.entry.forEach((pattern) => {
      glob_1.default.sync(pattern).forEach((relativePath) => {
        rawStyleEntries.push(path_1.default.resolve(relativePath));
      });
    });
    return new Promise((resolve, reject) => {
      let stream = (0, merge_stream_1.default)(
        patternArray.map((pattern) =>
          gulp_1.default.src(pattern, { allowEmpty: true, base: cssConfig.watchBase[pattern] })
        )
      ).pipe(
        (0, gulp_if_1.default)(({ path: filePath }) => {
          return cssConfig.additionalData && rawStyleEntries.indexOf(filePath) > -1;
        }, through2_1.default.obj(handleAdditionalData))
      );
      destDirs.forEach((dir) => {
        stream = stream.pipe(gulp_1.default.dest(dir));
      });
      stream.on('end', resolve).on('error', (error) => {
        suzume_dev_utils_1.print.error(
          '[suzume-build]',
          'Failed to build css, error in copying files'
        );
        console.error(error);
        reject(error);
      });
    });
  }
  return Promise.resolve(null);
}
// Dist all less files to dist
function distLess(cb) {
  const { path: distPath, rawFileName } = cssConfig.output.dist;
  let entries = [];
  cssConfig.entry.forEach((e) => {
    entries = entries.concat(glob_1.default.sync(e));
  });
  if (entries.length) {
    const texts = [];
    entries.forEach((entry) => {
      // Remove the first level directory
      const esEntry = cssConfig.output.es + entry.slice(entry.indexOf('/'));
      const relativePath = path_1.default.relative(distPath, esEntry);
      const text = `@import "${relativePath}";`;
      if (esEntry.startsWith(`${cssConfig.output.es}/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });
    fs_extra_1.default.outputFileSync(`${distPath}/${rawFileName}`, texts.join('\n'));
  }
  cb();
}
// Compile less, and output css to at es/lib
function compileLess() {
  const destDirs = [cssConfig.output.es, cssConfig.output.cjs].filter((path) => path);
  if (destDirs.length) {
    const { beforeCompile, afterCompile } = hook;
    let stream = gulp_1.default
      .src(cssConfig.entry, { allowEmpty: true })
      .pipe(
        (0, gulp_if_1.default)(
          !!cssConfig.additionalData,
          through2_1.default.obj(handleAdditionalData)
        )
      );
    if (typeof beforeCompile === 'function') stream = stream.pipe(beforeCompile());
    stream = stream.pipe(cssConfig.compiler(cssConfig.compilerOptions));
    if (typeof afterCompile === 'function') stream = stream.pipe(afterCompile());
    stream = stream.pipe((0, gulp_clean_css_1.default)());
    destDirs.forEach((dir) => {
      stream = stream.pipe(gulp_1.default.dest(dir));
    });
    return stream.on('error', (error) => {
      suzume_dev_utils_1.print.error(
        '[suzume-build]',
        'Failed to build css, error in compiling less'
      );
      console.error(error);
    });
  }
  return Promise.resolve(null);
}
// Compile the packaged less into css
function distCss(isDev) {
  const { beforeCompile, afterCompile } = hook;
  const { path: distPath, rawFileName, cssFileName } = cssConfig.output.dist;
  const needCleanCss =
    !isDev && (!constant_1.BUILD_ENV_MODE || constant_1.BUILD_ENV_MODE === 'production');
  let stream = gulp_1.default.src(`${distPath}/${rawFileName}`, { allowEmpty: true });
  if (typeof beforeCompile === 'function') stream = stream.pipe(beforeCompile());
  stream = stream.pipe(cssConfig.compiler(cssConfig.compilerOptions));
  if (typeof afterCompile === 'function') stream = stream.pipe(afterCompile());
  // Errors should be thrown, otherwise it will cause the program to exit
  if (isDev) {
    notifyLessCompileResult(stream);
  }
  return stream
    .pipe(
      // The less file in the /dist is packaged from the less file in /es, so its static resource path must start with ../es
      (0, gulp_replace_1.default)(
        new RegExp(`(\.{2}\/)+${cssConfig.output.es}`, 'g'),
        path_1.default.relative(cssConfig.output.dist.path, assetConfig.output)
      )
    )
    .pipe((0, gulp_if_1.default)(needCleanCss, (0, gulp_clean_css_1.default)()))
    .pipe((0, gulp_rename_1.default)(cssFileName))
    .pipe(gulp_1.default.dest(distPath))
    .on('error', (error) => {
      suzume_dev_utils_1.print.error(
        '[suzume-build]',
        'Failed to build css, error in dist all css'
      );
      console.error(error);
    });
}
/**
 * Match the resource that matches the entry glob and copy it to the /asset
 * @returns Stream
 */
function copyAsset() {
  return gulp_1.default
    .src(assetConfig.entry, { allowEmpty: true })
    .pipe(gulp_1.default.dest(assetConfig.output));
}
function watch() {
  const cwd = process.cwd();
  const fastBuild = gulp_1.default.parallel(
    copyAsset,
    gulp_1.default.series(copyFileWatched, distLess, () => {
      distCss(true);
    })
  );
  // First build
  fastBuild(null);
  const watcher = chokidar_1.default.watch(cssConfig.watch, {
    ignoreInitial: true,
  });
  watcher.on('all', (event, fullPath) => {
    const relPath = fullPath.replace(cwd, '');
    suzume_dev_utils_1.print.info(`[${event}] ${relPath}`);
    try {
      fastBuild(null);
    } catch (_a) {}
  });
}
exports.watch = watch;
function build() {
  return new Promise((resolve) => {
    gulp_1.default.series(
      gulp_1.default.parallel(copyAsset, copyFileWatched),
      gulp_1.default.parallel(compileLess, handleStyleJSEntry_1.default),
      gulp_1.default.parallel(distLess, distCss.bind(null, false)),
      gulp_1.default.parallel(() => resolve(null))
    )(null);
  });
}
exports.build = build;
