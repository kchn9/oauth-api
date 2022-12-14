import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validationMiddleware =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
            });
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    errors: e.errors,
                });
            }
            return res.sendStatus(400);
        }
    };

export { validationMiddleware };
