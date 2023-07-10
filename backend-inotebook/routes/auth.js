//authentication related endpoints are here
const express = require("express");
const User = require("../models/User");

const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "Aakritee@1234";
var fetchuser = require("../middleware/fetchuser");

//Endpoint to create user
// ROUTE 1: Create a user using: POST "/api/auth/createuser".No login require
//Defining the Route Handler for User Registration:

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    //if there are errors,return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() }); // Return early if there are validation errors
    }
    //database ma rakhni kam if error vayena vane ie creating users

    try {
      //Checking whether the user with this email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10); //await ko meaning is jabasamma yo bcypt.gensalt(10) wala promise chalera vyaunna taba samma tala najani salt ko value lerai jani tala

      const secPass = await bcrypt.hash(req.body.password, salt);

      //exist xaina vane create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      //Token generation

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken }); // Send the user as response
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      //aru kei error xa vane
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

//Endpoint to authenticate user
// ROUTE 2: Authenticate the user using: POST "/api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],

  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
    const { email, password } = req.body; //destructing garexam email ra password pauna lai (req.body is a property in Express.js that represents the data sent in the request body of an HTTP request)
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      bcrypt.compare(password, user.password, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Please try to login with correct credentials" });
        }
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      //aru kei error xa vane
      console.error(error);
      res.status(500).json({ error: "Server error occured" });
    }
  }
);
//ROUTE 3: Get LOgged in user details using :POST /api/auth/getuser:Required login yeha hamile token pathauna parxa
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
