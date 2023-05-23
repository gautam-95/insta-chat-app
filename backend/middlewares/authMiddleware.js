const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedUser.id).select("-password");

      next();
    } catch (err) {
      console.error(err);
      res.status(401);
      throw new Error("User is not authorized");
    }
  }
});

module.exports = protect;