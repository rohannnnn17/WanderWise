const express = require("express");
const { check } = require("express-validator");
const UsersControllers = require("../controllers/users-controllers");

const router = express.Router();

// Fetch users
router.get("/", UsersControllers.getUsers);

// Sign up route
router.post(
  "/signup",
  check("name").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  UsersControllers.signup
);

// Login route
router.post("/login", UsersControllers.login);

module.exports = router;
