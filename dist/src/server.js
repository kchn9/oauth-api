"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("./app"));
const { port } = config_1.default.get("server");
const app = new app_1.default(port);
app.listen();
