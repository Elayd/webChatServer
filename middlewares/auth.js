import jwt from "jsonwebtoken";
import { config } from "../config.js";
export const protect = (req, res, next) => {
  const token = req.cookies["access-token"];
  if (!token) {
    return res.status(400).json({ message: "No token" });
  }
  try {
    jwt.verify(token, config.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Wrong" });
  }
};
