import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response, Router } from "express";
import Mailer from "../utils/mailer.utils";
import Controller from "../interfaces/Controller.interface";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import { validationMiddleware } from "../middleware/validation.middleware";
import UserService from "../services/user.service";
import {
    create,
    CreateUserBody,
    sendResetPasswordCode,
    SendResetPasswordCodeBody,
    resetPassword,
    ResetPasswordBody,
    ResetPasswordParams,
    verify,
    VerifyUserParams,
} from "../validators/user.validator";
import { requireTokenMiddleware } from "../middleware/requireToken.middleware";
import VerifiedToken from "../interfaces/VerifiedToken.interface";

class UserController implements Controller {
    public path: string = "/users";
    public router: Router = Router();
    private service: UserService = new UserService();
    private mailer: Mailer = new Mailer();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        /**
         * @route GET /api/users
         */
        this.router.get(this.path, requireTokenMiddleware, this.getCurrentUser);

        /**
         * @route POST /api/users
         */
        this.router.post(this.path, validationMiddleware(create), this.create);

        /**
         * @route GET /api/users/verify/:id&:verificationCode
         */
        this.router.get(
            `${this.path}/verify/:id&:verificationCode`,
            validationMiddleware(verify),
            this.verify
        );

        /**
         * @route POST /api/users/password/reset
         */
        this.router.post(
            `${this.path}/password/reset`,
            validationMiddleware(sendResetPasswordCode),
            this.sendResetPasswordCode
        );

        /**
         * @route POST /api/users/password/reset/:id&:resetPasswordCode
         */
        this.router.post(
            `${this.path}/password/reset/:id&:resetPasswordCode`,
            validationMiddleware(resetPassword),
            this.resetPassword
        );
    };

    private create = async (
        req: Request<{}, {}, CreateUserBody>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await this.service.create(req.body);
            await this.mailer.sendConfirmationMessage({
                targetId: user.id,
                targetEmail: user.email,
                targetUsername: user.username,
                verificationCode: user.verificationCode,
            });
            return res.status(201).json(user);
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === "P2002"
            ) {
                const message =
                    e.meta && e.meta.target
                        ? `${e.meta.target
                              .toString()
                              .split("_")
                              .join(" ")} has to be unique.`
                        : "User fields to be unique.";
                next(new HttpError(409, message));
            }
            next(e);
        }
    };

    private getCurrentUser = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token: VerifiedToken = res.locals.token;
            const userId = token.userId;
            const user = await this.service.find({ id: userId });
            res.status(200).json(user);
        } catch (e) {
            next(e);
        }
    };

    private verify = async (
        req: Request<VerifyUserParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.params.id;
            const verificationCode = req.params.verificationCode;
            await this.service.verify(userId, verificationCode);
            res.status(200).json({
                message: "User verified successfully",
            });
        } catch (e) {
            next(e);
        }
    };

    private sendResetPasswordCode = async (
        req: Request<{}, {}, SendResetPasswordCodeBody>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const email = req.body.email;
            const user = await this.service.find({
                email,
            });
            if (!user || !user.verified) {
                throw new HttpError(404, "User email is not verified.");
            }
            const resetCode = await this.service.generateResetPasswordCode({
                id: user.id,
            });
            await this.mailer.sendResetMessage({
                targetEmail: email,
                resetCode,
            });
            res.status(200).json({
                resetCode,
            });
        } catch (e) {
            next(e);
        }
    };

    private resetPassword = async (
        req: Request<ResetPasswordParams, {}, ResetPasswordBody>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.params.id;
            const resetCode = req.params.resetPasswordCode;
            const newPassword = req.body.password;
            await this.service.resetPassword(
                { id: userId },
                resetCode,
                newPassword
            );
            // generate new code
            await this.service.generateResetPasswordCode({
                id: userId,
            });
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    };
}

export default UserController;
