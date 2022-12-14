import { Request, Response, NextFunction } from "express";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import { logger } from "../utils/logger.utils";

const errorHandlingMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = error instanceof HttpError ? error.status : 500;
    const { message } = error;

    logger.error(message);

    res.status(status).json({
        status,
        message,
    });

    next();
};

export { errorHandlingMiddleware };
