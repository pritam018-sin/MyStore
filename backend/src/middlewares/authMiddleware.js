import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User no longer exists.");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error(error.message || "Authentication failed. Invalid or expired token.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin." });
  }
};

export { authenticate, authorizeAdmin };
