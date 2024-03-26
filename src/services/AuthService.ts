const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/UserRepository");

const login = async (username, password) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) {
    throw new Error("Authentication failed");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Authentication failed");
  }
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { login };
