import pino from "pino";
import pinoPrettier from "pino-pretty";
import dayjs from "dayjs";

const prettier = pinoPrettier({
    colorize: true,
});

const logger = pino(
    {
        base: {
            pid: false,
        },
        timestamp: () => `,"time":"${dayjs().format()}"`,
    },
    prettier
);

export { logger };
