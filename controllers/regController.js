import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const registration = async (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email: email,
      password: hash,
    })
      .then(() => {
        res.json("Success");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
};
