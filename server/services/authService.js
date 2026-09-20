import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const safeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const registerUser = async (
  name,
  email,
  password
) => {
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  return {
    user: safeUser(user),
    token,
  };
};

export const loginUser = async (
  email,
  password
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect =
    await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user: safeUser(user),
    token,
  };
};