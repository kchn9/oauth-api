import express, { Application } from "express";
import { errorHandlingMiddleware } from "./middleware/errorHandling.middleware";
import { httpLogger } from "./middleware/httpLogger.middleware";
import { logger } from "./utils/logger.utils";

class App {
    private express: Application;
    private port: number;

    constructor(port: number) {
        this.express = express();
        this.port = port;
        this.initializeMiddleware();
        this.initializeErrorMiddleware();
    }

    private initializeMiddleware = (): void => {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(httpLogger());
    };

    private initializeErrorMiddleware = (): void => {
        this.express.use(errorHandlingMiddleware);
    };

    public listen = (): void => {
        this.express.listen(this.port, () => {
            logger.info(`Server is running on port: ${this.port}`);
        });
    };
}

export default App;
