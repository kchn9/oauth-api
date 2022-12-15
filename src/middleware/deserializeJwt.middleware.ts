import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import SessionService from "../services/session.service";
import JwtUtils from "../utils/jwt.utils";

const deserializeJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const jwt = new JwtUtils();
    const accessHeader = req.headers.authorization;
    if (!accessHeader) {
        return next();
    }
    const accessToken: string = accessHeader.replace(/^Bearer\s/, "");
    try {
        const extractedToken = jwt.verify(accessToken); // throws when token expired or invalid
        res.locals.token = extractedToken;

        return next();
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            const refreshHeader = req.get("x-refresh");
            if (!refreshHeader) return next(e);
            try {
                const sessionService = new SessionService();
                const newAccessToken = await sessionService.refresh(
                    refreshHeader
                );
                if (!newAccessToken) return next(e);
                res.setHeader("x-access-token", accessToken);
                const newExtractedToken = jwt.verify(newAccessToken);
                res.locals.token = newExtractedToken;

                return next();
            } catch (err) {
                return next(err);
            }
        }
        return next(e);
    }
};

export default deserializeJwt;
