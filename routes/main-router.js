import express from "express";

import { authRouter } from "./sub-routes/auth-router.js";
import { dashboardRouter } from "./sub-routes/dashboard-router.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/dashboard", dashboardRouter);

export { router };
