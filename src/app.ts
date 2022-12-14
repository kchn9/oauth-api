import express, { Application } from "express";
import { logger } from "./utils/logger.utils";

class App {
    private express: Application;
    private port: number;

    constructor(port: number) {
        this.express = express();
        this.port = port;
    }

    public listen() {
        this.express.listen(this.port, () => {
            logger.info(`Server is running on port: ${this.port}`);
        });
    }
}

export default App;
