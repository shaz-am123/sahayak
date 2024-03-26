const userService = require('../services/UserService');

const registerUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const user = await userService.registerUser(name, username, password);
    res.status(201)
    res.json(user);
  } catch (error) {
    res.status(500)
    res.json({ error: "Registration failed" });
  }
}

module.exports = { registerUser };
