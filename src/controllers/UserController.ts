import User from "dto/User";
import userService from "../services/UserService";

class UserController{
  async registerUser(user: User){
    try {
      const registeredUser = await userService.registerUser(user);
      return {
        status: 200,
        body: registeredUser,
      };
    } catch (error) {
      return {
        status: 500,
        body: { error: "Registration failed" },
      };
    }
  };
}

export default new UserController();
