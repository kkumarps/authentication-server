import jwt from "jsonwebtoken";

import { SQLDriver } from "../model/sql-driver.js";
import { config } from "../util/config.js";

async function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, config.jwtSecretKey);

    const sqlDriver = new SQLDriver({ email: decoded.email }, "tokens"),
      fecthedData = await sqlDriver.read();

    if (fecthedData.status === 500) return fecthedData;

    if (
      fecthedData.message.email === decoded.email &&
      fecthedData.message.token === token
    )
      next();
    else return res.status(401).send("Invalid token");
  } catch (error) {
    console.log(error.message);
    res.status(401).send("Invalid token");
  }
}

export { verifyToken };
