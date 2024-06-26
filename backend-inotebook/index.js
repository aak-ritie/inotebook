//Here Express js server is created

const connectToMongo = require("./db");

const express = require("express");

connectToMongo();
const app = express();
const port = 3001;
//res.body lai use garna this middleware is necessary
app.use(express.json());
//Available Routes app.use is Express.js method used to register middleware function
//Registers the /api/auth route and associates it with the routes defined in the ./routes/auth module.

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
