import pinoHttp from "pino-http";
import PinoPretty from "pino-pretty";

const prettier = PinoPretty({
    colorize: true,
});

export const httpLogger = () => pinoHttp({}, prettier);
