const authService = require("../services/AuthService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200)
    res.json({ token });
  } catch (error) {
    res.status(500)
    res.json({ error: "Login failed" });
  }
};

module.exports = { login };
