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
const path_1 = __importDefault(require('path'));
const fs_extra_1 = __importDefault(require('fs-extra'));
const vinyl_fs_1 = __importDefault(require('vinyl-fs'));
const through2_1 = __importDefault(require('through2'));
const chokidar_1 = __importDefault(require('chokidar'));
const gulp_if_1 = __importDefault(require('gulp-if'));
const gulp_typescript_1 = __importDefault(require('gulp-typescript'));
const gulp_plumber_1 = __importDefault(require('gulp-plumber'));
const lodash_debounce_1 = __importDefault(require('lodash.debounce'));
const node_typescript_compiler_1 = __importDefault(require('node-typescript-compiler'));
const suzume_dev_utils_1 = require('../../../../vendor/dev-utils');
const core_1 = require('@babel/core');
const tsc_config_1 = __importDefault(require('../../../config/tsc.config'));
const babel_config_1 = __importDefault(require('../../../config/babel.config'));
const constant_1 = require('../../../constant');
/**
 * Get config in tsconfig.json
 */
const getTSConfig = (
  tsconfigPath = path_1.default.resolve(constant_1.CWD, 'tsconfig.json'),
  subConfig = { compilerOptions: {} }
) => {
  if (fs_extra_1.default.pathExistsSync(tsconfigPath)) {
    const config = fs_extra_1.default.readJsonSync(tsconfigPath);
    const compilerOptions = (config && config.compilerOptions) || {};
    const subCompilerOptions = (subConfig && subConfig.compilerOptions) || {};
    // Avoid overwriting of the compilation options of subConfig
    subConfig.compilerOptions = Object.assign(
      Object.assign({}, compilerOptions),
      subCompilerOptions
    );
    Object.assign(config, subConfig);
    if (config.extends) {
      return getTSConfig(
        path_1.default.resolve(path_1.default.dirname(tsconfigPath), config.extends),
        config
      );
    }
    return config;
  }
  return Object.assign({}, subConfig);
};
/**
 * Build TS with babel
 */
function withBabel({ type, outDir, watch }) {
  return __awaiter(this, void 0, void 0, function* () {
    const tsconfig = getTSConfig();
    const targetPath = path_1.default.resolve(constant_1.CWD, outDir);
    // The base path of the matching directory patterns
    let srcPath = '';
    for (const pattern of tsconfig.include) {
      // match 'src/**/*.ts` or 'src/**/*.{ts,tsx}' or 'src/**/*.t{s,sx}'
      if (/\/\*{2}\/\*\.{?t{?s/.test(pattern)) {
        srcPath = pattern.split('/**/')[0];
        break;
      }
    }
    const transform = (file) => {
      // Avoid directly modifying the original presets array, it will cause errors when withBabel is called multiple times
      babel_config_1.default.presets = babel_config_1.default.presets.map((preset) => {
        const strPresetEnv = '@babel/preset-env';
        const presetOptions = { modules: type === 'es' ? false : 'cjs' };
        if (preset === strPresetEnv) {
          return [strPresetEnv, presetOptions];
        }
        if (Array.isArray(preset) && preset[0] === strPresetEnv) {
          const _preset = preset.slice();
          _preset[1] = Object.assign(Object.assign({}, _preset[1] || {}), presetOptions);
          return _preset;
        }
        return preset;
      });
      return (0, core_1.transform)(
        file.contents,
        Object.assign(Object.assign({}, babel_config_1.default), {
          filename: file.path,
          // Ignore the external babel.config.js and directly use the current incoming configuration
          configFile: false,
        })
      ).code;
    };
    const createStream = (src) => {
      return vinyl_fs_1.default
        .src(src, {
          allowEmpty: true,
          base: srcPath,
        })
        .pipe(watch ? (0, gulp_plumber_1.default)() : through2_1.default.obj())
        .pipe(
          (0, gulp_if_1.default)(
            ({ path }) => {
              return /\.tsx?$/.test(path);
            },
            // Delete outDir to avoid static resource resolve errors during the babel compilation of next step
            (0, gulp_typescript_1.default)(
              Object.assign(Object.assign({}, tsconfig.compilerOptions), {
                declaration: type === 'es',
                outDir: undefined,
              })
            )
          )
        )
        .pipe(
          (0, gulp_if_1.default)(
            ({ path }) => {
              return !path.endsWith('.d.ts') && /\.(t|j)sx?$/.test(path);
            },
            through2_1.default.obj((file, _, cb) => {
              try {
                file.contents = Buffer.from(transform(file));
                // .jsx -> .js
                file.path = file.path.replace(path_1.default.extname(file.path), '.js');
                cb(null, file);
              } catch (error) {
                suzume_dev_utils_1.print.error('[suzume-build]', `Failed to compile ${file.path}`);
                console.error(error);
                cb(null);
              }
            })
          )
        )
        .pipe(vinyl_fs_1.default.dest(targetPath));
    };
    return new Promise((resolve) => {
      const patterns = [
        ...tsconfig.include,
        `!${path_1.default.resolve(srcPath, '**/demo{,/**}')}`,
        `!${path_1.default.resolve(srcPath, '**/__test__{,/**}')}`,
        `!${path_1.default.resolve(srcPath, '**/*.md')}`,
        `!${path_1.default.resolve(srcPath, '**/*.mdx')}`,
      ];
      createStream(patterns).on('end', () => {
        if (watch) {
          suzume_dev_utils_1.print.info(
            '[suzume-build]',
            `Start watching file in ${srcPath.replace(`${constant_1.CWD}/`, '')}...`
          );
          const watcher = chokidar_1.default.watch(patterns, {
            ignoreInitial: true,
          });
          const files = [];
          const debouncedCompileFiles = (0, lodash_debounce_1.default)(() => {
            while (files.length) {
              createStream(files.pop());
            }
          }, 1000);
          watcher.on('all', (event, fullPath) => {
            suzume_dev_utils_1.print.info(
              `[${event}] ${path_1.default.join(fullPath).replace(`${constant_1.CWD}/`, '')}`
            );
            if (
              fs_extra_1.default.existsSync(fullPath) &&
              fs_extra_1.default.statSync(fullPath).isFile()
            ) {
              if (!files.includes(fullPath)) {
                files.push(fullPath);
              }
              debouncedCompileFiles();
            }
          });
        } else {
          resolve(null);
        }
      });
    });
  });
}
/**
 * Build TS with tsc
 */
function withTSC({ type, outDir, watch }) {
  const { compilerOptions } = getTSConfig();
  let module = type === 'es' ? 'es6' : 'commonjs';
  // Read module filed from the default configuration (es6 / es2020 / esnext)
  if (type === 'es') {
    const regexpES = /^es/i;
    if (
      typeof tsc_config_1.default.module === 'string' &&
      regexpES.test(tsc_config_1.default.module)
    ) {
      module = tsc_config_1.default.module;
    } else if (
      typeof (compilerOptions === null || compilerOptions === void 0
        ? void 0
        : compilerOptions.module) === 'string' &&
      regexpES.test(compilerOptions.module)
    ) {
      module = compilerOptions.module;
    }
  }
  return node_typescript_compiler_1.default.compile(
    Object.assign(Object.assign({}, tsc_config_1.default), {
      module,
      outDir,
      watch: !!watch,
      declaration: type === 'es',
    })
  );
}
exports.default = (options) => {
  suzume_dev_utils_1.print.info('[suzume-build]', `Start to build ${options.type} module...`);
  return (
    constant_1.BUILD_ENV_TS_COMPILER === 'babel' ? withBabel(options) : withTSC(options)
  ).then(
    () =>
      suzume_dev_utils_1.print.success('[suzume-build]', `Build ${options.type} module success!`),
    (error) => {
      throw error;
    }
  );
};
