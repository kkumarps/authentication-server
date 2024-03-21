import express from "express";

import { Auth } from "../../controller/auth.js";
import { verifyToken } from "../../middleware/verify-token.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  const auth = new Auth(req.body);
  let respMsg;

  if (req.body.otp) respMsg = await auth.validateOTP();
  else respMsg = await auth.signup();

  return res.status(respMsg.status).send(respMsg.message);
});

authRouter.post("/login", async (req, res, next) => {
  const auth = new Auth(req.body),
    respMsg = await auth.login();
  return res.status(respMsg.status).send(respMsg.message);
});

authRouter.get("/logout", verifyToken, async (req, res, next) => {
  const auth = new Auth(req.headers["authorization"]),
    respMsg = await auth.logout();
  return res.status(respMsg.status).send(respMsg.message);
});

export { authRouter };
