"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const dayjs_1 = __importDefault(require("dayjs"));
const prettier = (0, pino_pretty_1.default)({
    colorize: true,
});
const logger = (0, pino_1.default)({
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${(0, dayjs_1.default)().format()}"`,
}, prettier);
exports.logger = logger;
