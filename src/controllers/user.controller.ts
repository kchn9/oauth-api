import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/Controller.interface";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import { validationMiddleware } from "../middleware/validation.middleware";
import UserService from "../services/user.service";
import { create, CreateUserBody } from "../validators/user.validator";

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
            const user = await this.service.create(req.body);
            res.status(201).json(user);
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === "P2002"
            ) {
                const message =
                    e.meta && e.meta.target
                        ? `${e.meta.target.toString()} has to be unique.`
                        : "User fields to be unique.";
                next(new HttpError(400, message));
            }
            next(e);
        }
    };
}

export default UserController;
