import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { config } from "./util/config.js";
import { router } from "./routes/main-router.js";
import { notFound } from "./middleware/not-found.js";
import { createConn } from "./model/sql-driver.js";

const app = express();

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);

// app.use();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

app.use("/api/v1", router);
app.use(notFound);

(async () => {
  const connStatus = await createConn();

  if (connStatus === 1) {
    app.listen(config.port, () => {
      console.log(`Server listening on port: ${config.port}`);
    });
    return;
  } else {
    console.error(
      `Database could not be connected. Please check the console log for error`
    );
    return;
  }
})();
