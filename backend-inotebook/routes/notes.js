//notes related endpoint are here
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.json([]);
});
module.exports = router;
