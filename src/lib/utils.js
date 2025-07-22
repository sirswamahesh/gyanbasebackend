const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ✅ required on Render (HTTPS)
    sameSite: "Strict", // ✅ required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
