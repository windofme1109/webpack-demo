/**
 *
 * 自己实现对模块的打包
 *
 */

const source = {
    "./src/index.js": {
        "dependencies": {"./message.js":"src\\message.js"},
        "code": "\"use strict\";\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\n\
nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_message[\"default\"]);"
    },
    "src\\message.js": {
        "dependencies": {"./word.js":"src\\word.js"},
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _word = require(\"./word.js\");\n\nvar message = \"say \".concat(_word.word);\nvar _default = message;\nexports[\"default\"] = _default;"
    },
    "src\\word.js": {
        "dependencies": {},
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.word = void 0;\nvar word = 'word';\nexports.word = word;"
    }
}

const moduleAnalyzer = (module) => {}


const makeDependeciesGraph = (entry) => {}

const generateCode = (entry) => {}