import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const refreshController = async (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
    res.cookie("access-token", newAccessToken, {
      httpOnly: true,
    });
    res.status(200).json({ message: "Success" });
  } catch (_) {
    res.status(401).json({ message: "Failed" });
  }
};
