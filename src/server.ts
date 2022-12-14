import config from "config";
import App from "./app";

const { port } = config.get<{ port: number }>("server");
const app = new App(port);

app.listen();
