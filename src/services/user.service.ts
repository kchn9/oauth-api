import { PrismaClient, User } from "@prisma/client";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import hashPassword from "../middleware/db/hashPassword.middleware";
import { CreateUserBody } from "../validators/user.validator";

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
            const user = this.dbClient.user.create({
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
            const user = this.dbClient.user.findUnique({
                where: query,
            });
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            return user;
        } catch (e) {
            throw e;
        }
    };
}

export default UserService;
