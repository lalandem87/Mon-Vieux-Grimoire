const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isToken = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = { userId: isToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token Invalide" });
  }
};

module.exports = requireLogin;
