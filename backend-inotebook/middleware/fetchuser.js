//middleware is the function that can handle http request and response ab ayo middleware lai router.post ko argument ma pathauni
//this middleware is use to fetvh the user from the database

var jwt = require("jsonwebtoken");
const JWT_SECRET = "Aakritee@1234";

//middleware function le req res ra next wala argument linxa.. last ma gara we will call the next so that next middleware will be called ahile ko case ma next is async (req,res)

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add is to req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchuser;
