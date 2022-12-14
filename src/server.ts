import config from "config";
import App from "./app";
import UserController from "./controllers/user.controller";

const { port } = config.get<{ port: number }>("server");
const app = new App([new UserController()], port);

app.listen();
