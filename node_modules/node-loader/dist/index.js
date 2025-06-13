"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.raw = void 0;
var _loaderUtils = require("loader-utils");
var _options = _interopRequireDefault(require("./options.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

function loader(content) {
  const options = this.getOptions(_options.default);
  const name = (0, _loaderUtils.interpolateName)(this, typeof options.name !== "undefined" ? options.name : "[contenthash].[ext]", {
    context: this.rootContext,
    content
  });
  this.emitFile(name, content);
  return `
try {
  process.dlopen(module, require("path").join(__dirname, __webpack_public_path__, ${JSON.stringify(name)})${typeof options.flags !== "undefined" ? `, ${JSON.stringify(options.flags)}` : ""});
} catch (error) {
  throw new Error('node-loader:\\n' + error);
}
`;
}
const raw = exports.raw = true;