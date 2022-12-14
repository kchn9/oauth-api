import { object, string, TypeOf } from "zod";

export const create = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Invalid email"),
        username: string({
            required_error: "Username is required",
        }),
        password: string({
            required_error: "Password is required",
        }).min(8, "Password should be at least 8 chars long"),
    }),
});

export const update = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Invalid email"),
        username: string({
            required_error: "Username is required",
        }),
        password: string({
            required_error: "Password is required",
        }).min(8, "Password should be at least 8 chars long"),
    }).partial(),
});

export type CreateUserBody = TypeOf<typeof create>["body"];
export type UpdateUserBody = TypeOf<typeof update>["body"];
