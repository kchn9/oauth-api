import { PrismaClient, User } from "@prisma/client";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import hashPassword from "../middleware/db/hashPassword.middleware";
import { CreateUserBody } from "../validators/user.validator";
import { randomUUID } from "crypto";

class UserService {
    private dbClient: PrismaClient;

    constructor() {
        this.dbClient = new PrismaClient();
        this.initializeMiddleware();
    }

    private initializeMiddleware = () => {
        this.dbClient.$use(hashPassword);
    };

    /**
     * Creates user
     * @param {CreateUserBody} body
     */
    public create = async (body: CreateUserBody): Promise<User> => {
        try {
            const user = await this.dbClient.user.create({
                data: body,
            });
            return user;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Finds user depending on specified query
     * @param {Partial<User>} query
     */
    public find = async (query: Partial<User>): Promise<User | null> => {
        try {
            const user = await this.dbClient.user.findUnique({
                where: query,
            });
            return user;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Generates and assigns new password reset code to user
     * @param {Partial<User>} query
     * @returns {string} newResetCode
     */
    public generateResetPasswordCode = async (
        query: Partial<User>
    ): Promise<string> => {
        try {
            const newResetCode = randomUUID();
            await this.dbClient.user.update({
                where: query,
                data: {
                    passwordResetCode: newResetCode,
                },
            });
            return newResetCode;
        } catch (e) {
            throw e;
        }
    };

    public resetPassword = async (
        query: Partial<User>,
        resetCode: string,
        newPassword: string
    ): Promise<void> => {
        try {
            const user = await this.find(query);
            if (!user || user.passwordResetCode !== resetCode) {
                throw new HttpError(400, "Invalid reset code");
            }
            await this.dbClient.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: newPassword,
                },
            });
        } catch (e) {
            throw e;
        }
    };

    /**
     * Verifies user email
     * @param {string} userId
     * @param {string} verificationCode
     */
    public verify = async (
        userId: string,
        verificationCode: string
    ): Promise<void> => {
        try {
            const user = await this.find({ id: userId });
            if (!user) throw new HttpError(404, "User not found");
            if (user.verified) throw new HttpError(410, "Already verified");
            if (user.verificationCode !== verificationCode)
                throw new HttpError(400, "Unable to verify user");

            await this.dbClient.user.update({
                where: { id: user.id },
                data: { verified: true },
            });
        } catch (e) {
            throw e;
        }
    };
}

export default UserService;
