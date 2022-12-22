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

export const verify = object({
    params: object({
        id: string({
            required_error: "User id is required",
        }),
        verificationCode: string({
            required_error: "Verification code is required",
        }),
    }),
});

export const sendResetPasswordCode = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Invalid email"),
    }),
});

export const resetPassword = object({
    params: object({
        id: string({
            required_error: "User id is required",
        }),
        resetPasswordCode: string({
            required_error: "Password reset code is required",
        }),
    }),
    body: object({
        password: string({
            required_error: "Password is required",
        }).min(8, "Password should be at least 8 chars long"),
    }),
});

export type CreateUserBody = TypeOf<typeof create>["body"];
export type UpdateUserBody = TypeOf<typeof update>["body"];
export type SendResetPasswordCodeBody = TypeOf<
    typeof sendResetPasswordCode
>["body"];
export type ResetPasswordBody = TypeOf<typeof resetPassword>["body"];

export type VerifyUserParams = TypeOf<typeof verify>["params"];
export type ResetPasswordParams = TypeOf<typeof resetPassword>["params"];
