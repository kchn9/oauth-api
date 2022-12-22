import { NextFunction, Request, Response, Router } from "express";
import VerifiedToken from "../interfaces/VerifiedToken.interface";
import { requireTokenMiddleware } from "../middleware/requireToken.middleware";
import Controller from "../interfaces/Controller.interface";
import { validationMiddleware } from "../middleware/validation.middleware";
import SessionService from "../services/session.service";
import { create, CreateSessionBody } from "../validators/session.validation";

class SessionController implements Controller {
    public router: Router = Router();
    path: string = "/sessions";

    private service = new SessionService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        /**
         * POST /api/sessions
         */
        this.router.post(this.path, validationMiddleware(create), this.create);

        /**
         * DELETE /api/sessions
         */
        this.router.delete(this.path, requireTokenMiddleware, this.invalidate);
    };

    private create = async (
        req: Request<{}, {}, CreateSessionBody>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const [accessToken, refreshToken]: [string, string] =
                await this.service.create(req.body, req.get("user-agent"));
            res.status(200).json({
                accessToken,
                refreshToken,
            });
        } catch (e) {
            next(e);
        }
    };

    private invalidate = async (
        req: Request<{}, {}, CreateSessionBody>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id: sessionId }: VerifiedToken = res.locals.token;
            await this.service.invalidate(sessionId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    };
}

export default SessionController;
