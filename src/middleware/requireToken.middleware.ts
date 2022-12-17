import { NextFunction, Request, Response } from "express";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import VerifiedToken from "../interfaces/VerifiedToken.interface";

const requireTokenMiddleware = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    const token: VerifiedToken = res.locals.token;
    if (!token) {
        next(new HttpError(401, "Unauthorized - invalid token"));
    }
    next();
};

export { requireTokenMiddleware };
