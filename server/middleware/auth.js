const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorise = (role) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).send("Access Denied: No Token Provided!");
    try {
      const user = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      console.log(user);
      if (user.role == role) {
        req.user = user;
        next();
      } else
        return res
          .status(401)
          .send(
            "Access Denied: You dont have correct privilege to perform this operation"
          );
    } catch (err) {
      console.log(err);
      res.clearCookie("token");
      //return res.redirect("/");
    }
  };
};

module.exports = authorise;
