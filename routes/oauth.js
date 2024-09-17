import express from "express";
import { getOAuthUrlController } from "../controllers/getOAuthUrlController.js";
import { tokenExchangeController } from "../controllers/tokenExchangeController.js";

const oAuthRoute = express.Router();

oAuthRoute.get("/url", getOAuthUrlController);

oAuthRoute.get("/token", tokenExchangeController);

export default oAuthRoute;
