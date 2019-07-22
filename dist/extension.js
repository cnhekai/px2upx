module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const process_1 = __webpack_require__(2);
const provider_1 = __webpack_require__(3);
let cog = null;
function activate(context) {
    cog = vscode.workspace.getConfiguration('px2upx');
    const process = new process_1.CssUpxProcess(cog);
    let provider = new provider_1.CssUpxProvider(process);
    const LANS = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus'];
    for (let lan of LANS) {
        let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
        context.subscriptions.push(providerDisposable);
    }
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.px2upx', (textEditor, edit) => {
        const doc = textEditor.document;
        let selection = textEditor.selection;
        if (selection.isEmpty) {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            selection = new vscode.Range(start, end);
        }
        let text = doc.getText(selection);
        textEditor.edit(builder => {
            builder.replace(selection, process.convertAll(text));
        });
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CssUpxProcess {
    constructor(cog) {
        this.cog = cog;
        this.rePx = /([-]?[\d.]+)p(x)?/;
        this.rePxAll = /([-]?[\d.]+)px/g;
    }
    /**
     * 换px转换成upx
     *
     * @private
     * @param {string} pxStr
     */
    pxToUpx(pxStr) {
        const px = parseFloat(pxStr);
        // let upxValue: number | string = +(px * (750 / this.cog.designWidth)).toFixed(this.cog.fixedDigits);
        let upxValue = px * (750 / this.cog.designWidth);
        return { px: pxStr, pxValue: px, upxValue, upx: upxValue + 'upx' };
    }
    /**
     * px转upx
     *
     * @param {string} text 需要转换文本，例如：10px 12p
     * @return {Object} { px: '10px', pxValue: 10, rem: '1rem', remValue: 1 }
     */
    convert(text) {
        let match = text.match(this.rePx);
        if (!match) {
            return null;
        }
        return this.pxToUpx(match[1]);
    }
    /** 批量转换 */
    convertAll(code) {
        if (!code) {
            return code;
        }
        return code.replace(this.rePxAll, (word) => {
            const res = this.pxToUpx(word);
            if (res) {
                return res.upx;
            }
            return word;
        });
    }
}
exports.CssUpxProcess = CssUpxProcess;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
class CssUpxProvider {
    constructor(process) {
        this.process = process;
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const res = this.process.convert(lineText);
            if (!res) {
                return resolve([]);
            }
            const item = new vscode.CompletionItem(`${res.pxValue}px -> ${res.upx}`, vscode.CompletionItemKind.Snippet);
            item.insertText = res.upx;
            return resolve([item]);
        });
    }
}
exports.CssUpxProvider = CssUpxProvider;


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map