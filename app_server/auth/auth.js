const jwt = require("jsonwebtoken");
const axios=require("axios")

const verifyToken = (req, res, next) => {
  let token=req.session.token;
  if (!token) {
    res.redirect("/girisyap")
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.redirect("/anasayfa")
    }
    next();
  });
};

module.exports={
    verifyToken
}