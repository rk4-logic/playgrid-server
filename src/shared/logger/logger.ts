import pino, { type LoggerOptions } from "pino";

import { env } from "../../config/env.js";

const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL,
};

if (env.NODE_ENV !== "production") {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  };
}

const logger = pino(loggerOptions);

export default logger;
