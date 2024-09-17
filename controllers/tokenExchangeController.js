import { config } from "../config.js";
import { getTokenParams } from "../helpers/oauth.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { handleTokensIntoCookie } from "../helpers/createTokens.js";

export const tokenExchangeController = async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  try {
    const tokenParam = getTokenParams(code);

    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);

    if (!id_token) return res.status(400).json({ message: "Auth error" });

    const { email } = jwt.decode(id_token);
    const user = await User.findOne({ email: email });

    if (!user) {
      await bcrypt.hash("randompass", 10).then((hash) => {
        User.create({
          email: email,
          password: hash,
        })
          .then(() => {
            const user = User.findOne({ email: email });
            return user;
          })
          .then((user) => {
            handleTokensIntoCookie(res, user._id);
          })
          .catch((err) => {
            if (err) {
              res.status(400).json({ error: err });
            }
          });
      });
    } else {
      handleTokensIntoCookie(res, user._id);
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
