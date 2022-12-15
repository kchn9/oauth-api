import { NextFunction, Request, Response, Router } from "express";
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
    };

    private create = async (
        req: Request<{}, {}, CreateSessionBody>,
        res: Response,
        next: NextFunction
    ) => {
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
}

export default SessionController;
