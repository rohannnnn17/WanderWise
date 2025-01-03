const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

// Get all users (without passwords)
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // Exclude passwords from the response
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed. Please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// Sign up
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already. Please log in instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://picsum.photos/200", // Placeholder image
    password, // Storing the password as plain text (not recommended)
    places: [], // Initialize with empty places array
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed. Please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed. Please try again later.",
      500
    );
    return next(error);
  }

  // Check if user exists and if the passwords match
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials. Could not log you in.",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }), // Return user data
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
