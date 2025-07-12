const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.requireAdminLogin = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/admin/login");
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return res.redirect("/admin/login");
    }
    req.admin = admin;
    req.user = admin;
    next();
  } catch (err) {
    return res.redirect("/admin/login");
  }
};
