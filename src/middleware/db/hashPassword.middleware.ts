import { Prisma } from "@prisma/client";
import { CreateUserBody } from "../../validators/user.validator";
import argon2, { argon2i } from "argon2";

/**
 * Database middleware that hashes password before saving everytime user password is created or updated.
 */
const hashPassword = async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
    try {
        if (
            String(params.model) === "User" &&
            (params.action === "create" || params.action === "update") &&
            params.args.data &&
            params.args.data.password
        ) {
            const { password: plainTextPassword }: { password: string } = params
                .args.data as CreateUserBody;
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
