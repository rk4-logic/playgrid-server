import logger from "./shared/logger/logger.js";
import { env } from "./config/env.js";
import server from "./app/server.js";

server.listen(env.PORT, () => {
  logger.info(`🚀 PlayGrid Server running on http://localhost:${env.PORT}`);
});
