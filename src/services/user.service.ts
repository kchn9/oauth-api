import { PrismaClient, User } from "@prisma/client";
import { CreateUserBody } from "validators/user.validator";

class UserService {
    private dbClient: PrismaClient = new PrismaClient();

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
}

export default UserService;
