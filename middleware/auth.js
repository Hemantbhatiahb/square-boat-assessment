const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(401)
          .json({ success: false, error: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(400).json({ error: "Access denied" });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(400).json({ error: "Invalid token" });
    }
  };
};

module.exports = auth;
