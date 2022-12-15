import express, { Application } from "express";
import { errorHandlingMiddleware } from "./middleware/errorHandling.middleware";
import { httpLogger } from "./middleware/httpLogger.middleware";
import { logger } from "./utils/logger.utils";
import { PrismaClient } from "@prisma/client";
import Controller from "./interfaces/Controller.interface";

class App {
    private express: Application;
    private port: number;
    private dbClient: PrismaClient = new PrismaClient();

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeDatabase();
        this.initializeMiddleware();
        this.initializeRoutes(controllers);
        this.initializeErrorMiddleware();
    }

    private initializeDatabase = async () => {
        try {
            await this.dbClient.$connect();
            logger.info("Database connection established");
        } catch (e) {
            logger.fatal("Unable to connect to db");
            logger.error(e);
            process.exit(1);
        }
    };

    private initializeMiddleware = (): void => {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(httpLogger());
    };

    private initializeRoutes = (controllers: Controller[]): void => {
        controllers.forEach((controller: Controller) =>
            this.express.use(`/api`, controller.router)
        );
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
