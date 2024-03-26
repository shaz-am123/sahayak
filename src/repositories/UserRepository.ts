const User = require("../models/User");

const createUser = async (name, username, password) => {
  try {
    const user = new User({ name, username, password });
    await user.save();
    return {
      name: name,
      username: username
    }
  } catch (error) {
    throw new Error("Failed to register user");
  }
};

const getUserByUsername = async (username) => {
  try{
    return await User.findOne({ username });
  }
  catch (error) {
    throw new Error("Failed to get user by username")
  }
};

module.exports = { createUser, getUserByUsername };
