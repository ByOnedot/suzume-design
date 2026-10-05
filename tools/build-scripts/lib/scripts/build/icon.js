'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_extra_1 = __importDefault(require('fs-extra'));
const suzume_dev_utils_1 = require('../../../vendor/dev-utils');
const icon_1 = __importDefault(require('../../config/webpack/icon'));
const webpackWithPromise_1 = __importDefault(require('../utils/webpackWithPromise'));
exports.default = () => {
  if (fs_extra_1.default.existsSync(icon_1.default.entry)) {
    suzume_dev_utils_1.print.info('[suzume-build]', 'Start to build icons...');
    return (0, webpackWithPromise_1.default)(icon_1.default).then(
      () => suzume_dev_utils_1.print.success('[suzume-build]', 'Build icons success!'),
      (error) => suzume_dev_utils_1.print.error(error)
    );
  }
  return Promise.resolve(null);
};
