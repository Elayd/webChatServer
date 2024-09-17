import express from "express";
import { authController } from "../controllers/authController.js";
import { refreshController } from "../controllers/refreshController.js";
import { registration } from "../controllers/regController.js";
import { checkAuthController } from "../controllers/checkAuthController.js";
import { protect } from "../middlewares/auth.js";

const securityRoute = express.Router();

securityRoute.post("/auth", authController);
securityRoute.post("/registration", registration);
securityRoute.post("/refresh", refreshController);

securityRoute.use(protect);

securityRoute.post("/checkAuth", checkAuthController);

export default securityRoute;
