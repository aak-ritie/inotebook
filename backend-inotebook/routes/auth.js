//authentication related endpoints are here
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { query, validationResult } = require("express-validator");
//Create a user using: POST "/api/auth/".Doesnot require Auth
router.post(
  "/",
  [
    query("name", "Enter a valid name")
      .notEmpty()
      .escape()
      .isLength({ min: 3 }),
    query("email", "Enter a valid email").isEmail(),
    query("password", "password must be atleast 5 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return res.send(`Hello, ${req.query.person}!`);
    }
    res.send({ errors: result.array() });
    //database ma rakhni kam
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.json(user);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
