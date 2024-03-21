import express from "express";

import {
  getCategoryList,
  getTotalCount,
  savePreference,
} from "../../controller/dashboard.js";
import { verifyToken } from "../../middleware/verify-token.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", verifyToken, async (req, res, next) => {
  let respMsg;
  if (req.query.action) {
    if (req.query.action === "totCount") {
      respMsg = await getTotalCount();
    }
    //
  } else if (req.query.list) {
    const pageNum = req.query.list;
    respMsg = await getCategoryList(pageNum);
    //
  } else next();

  return res.status(respMsg.status).send(respMsg.message);
});

dashboardRouter.post("/", verifyToken, async (req, res, next) => {
  let respMsg;
  if (req.query.action) {
    if (req.query.action === "savePreference") {
      respMsg = await savePreference(req.headers["authorization"], req.body);
    }
    //
  } else next();

  return res.status(respMsg.status).send(respMsg.message);
});

export { dashboardRouter };
