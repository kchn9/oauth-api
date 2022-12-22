import { NextFunction, Request, Response } from "express";
import SessionService from "../services/session.service";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import VerifiedToken from "../interfaces/VerifiedToken.interface";

const requireTokenMiddleware = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    const token: VerifiedToken = res.locals.token;
    if (!token) {
        next(new HttpError(401, "Unauthorized"));
    }
    const isValid = await new SessionService().isValid(token.id);
    if (!isValid) {
        next(new HttpError(401, "Invalid session"));
    }
    next();
};

export { requireTokenMiddleware };
