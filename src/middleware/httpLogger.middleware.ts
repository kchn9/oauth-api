import pinoHttp from "pino-http";
import PinoPretty from "pino-pretty";
import { IncomingMessage } from "http";
import { Request } from "express";

const prettier = PinoPretty({
    colorize: true,
});

export const httpLogger = () =>
    pinoHttp(
        {
            customProps: function (req: IncomingMessage) {
                const { body } = req as Request;
                return {
                    body: body,
                };
            },
        },
        prettier
    );
