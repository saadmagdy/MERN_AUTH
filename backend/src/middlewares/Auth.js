import jwt from "jsonwebtoken";
import asyncHandeler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import apiError from "../utils/apiError.js";

const auth = asyncHandeler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (!token) return next(apiError.create("No Token", 401));
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    return next();
  } catch (error) {
    return next(apiError.create("Invalid Token", 401));
  }
});

export default auth;
