import { Prisma } from "@prisma/client";
import { CreateUserBody } from "../../validators/user.validator";
import argon2, { argon2i } from "argon2";

const hashPassword = async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
    try {
        if (params.model === "User" && params.action === "create") {
            const { password: plainTextPassword } = params.args
                .data as CreateUserBody;
            const hash = await argon2.hash(plainTextPassword, {
                type: argon2i,
            });
            params.args.data.password = hash;
        }
        return next(params);
    } catch (e) {
        throw e;
    }
};

export default hashPassword;
