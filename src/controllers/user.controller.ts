import { NextFunction, Request, Response, Router } from "express";
import { validationMiddleware } from "../middleware/validation.middleware";
import UserService from "../services/user.service";
import { create, CreateUserBody } from "../validators/user.validator";
import Controller from "../interfaces/Controller.interface";
import { logger } from "../utils/logger.utils";

class UserController implements Controller {
    public path: string = "/users";
    public router: Router = Router();
    private service: UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        /**
         * POST /api/users
         */
        this.router.post(this.path, validationMiddleware(create), this.create);
    };

    private create = async (
        req: Request<{}, {}, CreateUserBody>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            logger.info("im here");
            const user = await this.service.create(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    };
}

export default UserController;
