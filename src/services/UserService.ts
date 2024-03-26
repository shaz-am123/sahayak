const userRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");


const registerUser = async (name, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await userRepository.createUser(name, username, hashedPassword)
};

module.exports = { registerUser };
