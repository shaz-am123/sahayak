import RegistrationRequest from "dto/RegistrationRequest";
import userService from "../services/UserService";
import HttpResponse from "../dto/HttpResponse";

class UserController {
  async registerUser(user: RegistrationRequest): Promise<HttpResponse> {
    try {
      const registeredUser = await userService.registerUser(user);
      return new HttpResponse(200, registeredUser);
    } catch (error) {
      return new HttpResponse(500, { error: "Registration failed" });
    }
  }
}

export default new UserController();
