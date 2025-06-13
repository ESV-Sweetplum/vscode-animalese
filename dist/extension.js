/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.disablingText = exports.enablingText = void 0;
exports.activate = activate;
exports.symbolToName = symbolToName;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(2));
const fs = __importStar(__webpack_require__(9));
const node_web_audio_api_1 = __webpack_require__(3);
const VOICE_LIST = [
    "Female Voice 1 (Sweet)",
    "Female Voice 2 (Peppy)",
    "Female Voice 3 (Big Sister)",
    "Female Voice 4 (Snooty)",
    "Male Voice 1 (Jock)",
    "Male Voice 2 (Lazy)",
    "Male Voice 3 (Smug)",
    "Male Voice 4 (Cranky)",
];
let extensionEnabled = true;
let volume = 0.5;
let vocalIndex = 0;
exports.enablingText = "Enabled Animalese Sounds. Type away!";
exports.disablingText = "Disabled Animalese Sounds.";
function activate(context) {
    volume = context.globalState.get("animalese-volume") || 0.5;
    vocalIndex = context.globalState.get("animalese-vocalIndex") || 0;
    const toggleCmd = vscode.commands.registerCommand("vscode-animalese.toggle", () => {
        extensionEnabled = !extensionEnabled;
        vscode.window.showInformationMessage(extensionEnabled ? exports.enablingText : exports.disablingText);
    });
    context.subscriptions.push(toggleCmd);
    const disableCmd = vscode.commands.registerCommand("vscode-animalese.disable", () => {
        extensionEnabled = false;
        vscode.window.showInformationMessage(exports.disablingText);
    });
    context.subscriptions.push(disableCmd);
    const enableCmd = vscode.commands.registerCommand("vscode-animalese.enable", () => {
        extensionEnabled = true;
        vscode.window.showInformationMessage(exports.enablingText);
    });
    context.subscriptions.push(enableCmd);
    const setVoiceCmd = vscode.commands.registerCommand("vscode-animalese.setVoice", () => {
        vscode.window
            .showQuickPick(VOICE_LIST, {
            title: "Set Voice",
            placeHolder: VOICE_LIST[1],
        })
            .then((v) => {
            if (!v)
                return;
            vscode.window.showInformationMessage(`Successfully set voice to ${v}.`);
            vocalIndex = VOICE_LIST.indexOf(v);
            context.globalState.update("animalese-vocalIndex", vocalIndex);
        });
    });
    context.subscriptions.push(setVoiceCmd);
    const setVolumeCmd = vscode.commands.registerCommand("vscode-animalese.setVolume", () => {
        vscode.window
            .showInputBox({
            title: "Set Volume",
            prompt: "What would you like the volume % to be? The response should be an integer within 1-100.",
            placeHolder: "50",
            validateInput: (str) => {
                if (isNaN(parseInt(str))) {
                    return {
                        message: "The input provided is not a number.",
                        severity: 3,
                    };
                }
                if (!Number.isInteger(parseFloat(str))) {
                    return {
                        message: "The input provided should be an integer.",
                        severity: 2,
                    };
                }
                return "";
            },
        })
            .then((v) => {
            if (!v)
                return;
            const percentage = Math.floor(parseFloat(v));
            vscode.window.showInformationMessage(`Successfully set volume to ${percentage}%.`);
            volume = percentage / 100;
            context.globalState.update("animalese-volume", volume);
        });
    });
    context.subscriptions.push(setVolumeCmd);
    vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (!extensionEnabled)
            return;
        const key = event.contentChanges[0].text.slice(0, 1);
        let filePath = "";
        switch (true) {
            case "abcdefghijklmnopqrstuvwxyz"
                .split("")
                .includes(key.toLowerCase()):
                {
                    filePath = path.join(__dirname, `..\\audio\\animalese\\${vocalIndex <= 3 ? "female" : "male"}\\voice_${(vocalIndex % 4) + 1}\\${key}.mp3`);
                    break;
                }
            case "1234567890-=".split("").includes(key): {
                filePath = path.join(__dirname, `..\\audio\\vocals\\${vocalIndex <= 3 ? "female" : "male"}\\voice_${(vocalIndex % 4) + 1}\\${"1234567890-="
                    .split("")
                    .indexOf(key)}.mp3`);
                break;
            }
            case key === "!" || key === "?": {
                if (true) {
                    // ADD PUNCTUATION NOISE SETTING
                    const noise = { "!": "Gwah", "?": "Deska" };
                    filePath = path.join(__dirname, `..\\audio\\animalese\\${vocalIndex <= 3 ? "female" : "male"}\\voice_${(vocalIndex % 4) + 1}\\${noise[key]}.mp3`);
                    break;
                }
            }
            case "~@#$%^&*(){}[]\\".split("").includes(key): {
                filePath = path.join(__dirname, `..\\audio\\sfx\\${symbolToName(key)}.mp3`);
                break;
            }
            default: {
                return;
            }
        }
        const audioContext = new node_web_audio_api_1.AudioContext();
        const initialBuffer = fs.readFileSync(filePath);
        const audioBuffer = initialBuffer.buffer.slice(initialBuffer.byteOffset, initialBuffer.byteOffset + initialBuffer.byteLength);
        const audioData = await audioContext.decodeAudioData(audioBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioData;
        source.detune.value = "1234567890-=".split("").includes(key)
            ? 0
            : Math.random() * 200 - 100;
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    });
}
function symbolToName(sym) {
    switch (sym) {
        case "~": {
            return "tilde";
        }
        case "!": {
            return "exclamation";
        }
        case "@": {
            return "at";
        }
        case "#": {
            return "pound";
        }
        case "$": {
            return "dollar";
        }
        case "%": {
            return "percent";
        }
        case "^": {
            return "caret";
        }
        case "&": {
            return "ampersand";
        }
        case "*": {
            return "asterisk";
        }
        case "(": {
            return "parenthesis_open";
        }
        case ")": {
            return "parenthesis_closed";
        }
        case "{": {
            return "brace_open";
        }
        case "}": {
            return "brace_closed";
        }
        case "[": {
            return "bracket_open";
        }
        case "]": {
            return "bracket_closed";
        }
        case "?": {
            return "question";
        }
    }
    return null;
}
function deactivate() { }


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("node-web-audio-api");

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ ((module) => {

module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map