'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const SUZUME_DESIGN_PACKAGE = '@byonedot/web-react';
const SUZUME_DESIGN_DIST = 'suzume';
const SUZUME_DESIGN_ICON_DIST = 'suzumeicon';
function default_1(context, request, callback) {
  // Compatible with webpack 5, its parameter is ({ context, request }, callback)
  if (typeof request === 'function' && context.request) {
    callback = request;
    request = context.request;
  }
  const getExternal = (packageName, dist, iconDist) => {
    if (request === packageName) {
      return {
        root: dist,
        commonjs: request,
        commonjs2: request,
      };
    }
    if (request === `${packageName}/icon`) {
      return {
        root: iconDist,
        commonjs: request,
        commonjs2: request,
      };
    }
  };
  const external = getExternal(SUZUME_DESIGN_PACKAGE, SUZUME_DESIGN_DIST, SUZUME_DESIGN_ICON_DIST);
  if (external) {
    return callback(null, external);
  }
  callback();
}
exports.default = default_1;
