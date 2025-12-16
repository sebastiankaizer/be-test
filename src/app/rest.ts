import server from "$server/instance";
import Logger from "$pkg/logger";
import { startFileWorker } from "$utils/fileWorker.utils";

const startRestApp = () => {
  Logger.info("Starting App : rest");

  const app = server.restServer();
  const PORT: number = Number(process.env.NODE_LOCAL_PORT) || 3010;

  // start background worker
  startFileWorker();

  return app.listen(PORT, () => {
    Logger.info(`Rest App is Running at Port ${PORT}`);
  });
};

export default startRestApp;