import User from "../models/User.js";
import apiError from "../utils/apiError.js";
import asyncHandeler from "../utils/asyncHandler.js";

// @desc     Register new user
// route     POST /api/users
// @access   Public
export const register = asyncHandeler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // check if the user already exists in the database
  const userExist = await User.findOne({ email });
  if (userExist) return next(apiError.create("Email is already taken", 400));
  // create a new user and save it to the database
  const user = await User.create({ name, email, password });
  // send back the response with status code of 201 Created and the data of the newly created user
  if (user) {
    return res
      .status(201)
      .json({ id: user._id, name: user.name, email: user.email });
  } else {
    return next(
      apiError.create("Something went wrong while creating an account.", 400)
    );
  }
});
// @desc     Auth user/set token
// route     POST /api/users/auth
// @access   Public
export const auth = asyncHandeler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist || !(await userExist.matchPassword(password))) {
    return next(apiError.create("Email or Password is Incorrect", 404));
  }
  userExist.generateToken(res);
  return res
    .status(201)
    .json({ id: userExist._id, name: userExist.name, email: userExist.email });
});
// @desc     LogOut user
// route     POST /api/users/logout
// @access   Public
export const logOut = asyncHandeler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "User Logged Out" });
});
// @desc     Get User Profile
// route     GET /api/users/profile
// @access   Private
export const getUserProfile = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) return next(apiError.create("No user found", 404));
  return res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
});
// @desc     Update User Profile
// route     Put /api/users/profile
// @access   Private
export const updateUserProfile = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return next(apiError.create("No user found", 404));
  } else {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    return res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }
});
// @desc     Delete User Profile
// route     Delete /api/users/profile
// @access   Private
export const deleteUserProfile = asyncHandeler(async (req, res, next) => { 
  const user = await User.findById(req.user?._id);
  if (!user) return next(apiError.create("No user found", 404));
  await User.findByIdAndDelete(user._id);
  res.status(200).json({ message: "Delete Profile" });
});
