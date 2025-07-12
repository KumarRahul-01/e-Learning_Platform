const jwt = require('jsonwebtoken');
const User = require('../model/user');



const AuthCheck = async (req, res, next) => {
  try {
    let token = null;

    
    // Safely check for headers
    if (req && req.headers) {
      if (req.headers["authorization"]) {
        // Handle Bearer token
        const authHeader = req.headers["authorization"];
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        } else {
          token = authHeader;
        }
      } else if (req.headers["x-access-token"]) {
        token = req.headers["x-access-token"];
      }
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ status: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(400).json({
      status: false,
      message: "Invalid token",
    });
  }
};

const isAdmin=(req,res,next)=>{
  if(req.user.role==="admin"){
    next();
  }else{
    res.status(401).json({
      status: false,
      message: "Access denied: Admins only",
    });
  }
}
module.exports = {AuthCheck,isAdmin};
