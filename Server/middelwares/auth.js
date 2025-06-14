const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Authentication failed , Token missing" });
  } else if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decode = jwt.verify(token, "secret_key");
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = auth;
