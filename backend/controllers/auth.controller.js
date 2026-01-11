import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);

  res.status(201).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  generateToken(res, user._id);
  res.json({ user });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

