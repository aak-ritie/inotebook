//notes related endpoint are here
const express = require("express");
var fetchusers = require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../models/User"); //notes wala module importing

//ROUTE1: Get all the notes GET "/api/notes/fetchallnotes".Login required
router.get("/fetchallnotes", fetchusers, async (req, res) => {
  //fetching all the notes hamile fetchuser middleware use garexam so hamro req.user ma user hunxa as agadi ko code ma data.user garexam ani user ko id le find garni ho so .id gareko
  try {
    const notes = await Note.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE 2: Add a new note using: POST "/api/notes/addnote"
router.post(
  "/addnote",

  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchusers,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.send({ errors: result.array() }); // Return only if there are validation errors
      }
      const note = new Note({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
