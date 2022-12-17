import { NextFunction, Request, Response } from "express";
import VerifiedToken from "../interfaces/VerifiedToken.interface";
import JwtUtils from "../utils/jwt.utils";
import { TokenExpiredError } from "jsonwebtoken";
import SessionService from "../services/session.service";
import { HttpError } from "../interfaces/errors/HttpError.interface";

const deserializeJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const jwt = new JwtUtils();
    const accessHeader = req.headers.authorization;
    if (!accessHeader) return next();

    const accessToken: string = accessHeader.replace(/^Bearer\s/, "");
    try {
        const extractedToken = jwt.verify(accessToken) as VerifiedToken; // throws when token expired or invalid
        res.locals.token = extractedToken;
        return next();
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            const refreshHeader = req.get("x-refresh");
            if (!refreshHeader) return next();
            try {
                const sessionService = new SessionService();
                const newAccessToken = await sessionService.refresh(
                    refreshHeader
                );
                if (!newAccessToken) return next();
                res.setHeader("x-access-token", accessToken);
                const newExtractedToken = jwt.verify(
                    newAccessToken
                ) as VerifiedToken;
                res.locals.token = newExtractedToken;
            } catch (err) {
                return next();
            }
        }
        return next();
    }
};

export default deserializeJwt;
