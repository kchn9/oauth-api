"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_utils_1 = require("./utils/logger.utils");
class App {
    constructor(port) {
        this.express = (0, express_1.default)();
        this.port = port;
    }
    listen() {
        this.express.listen(this.port, () => {
            logger_utils_1.logger.info(`Server is running on port: ${this.port}`);
        });
    }
}
exports.default = App;
