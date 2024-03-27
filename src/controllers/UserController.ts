import RegistrationRequest from "../dto/RegistrationRequest";
import userService from "../services/UserService";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../errors/CustomValidationError";

class UserController {
  async registerUser(
    registrationRequest: RegistrationRequest
  ): Promise<HttpResponse> {
    try {
      await registrationRequest.validateRequest();
      const registeredResponse = await userService.registerUser(
        registrationRequest
      );
      return new HttpResponse(200, registeredResponse);
    } catch (error) {
      return this.handleRegistrationErrors(error)
    }
  }

  private handleRegistrationErrors(error: any): HttpResponse{
    if (error instanceof CustomValidationError) {
      return new HttpResponse(400, { error: error.validationErrors });
    }
    
    return new HttpResponse(500, { error: error.message });
  }
}

const userController = new UserController();

export default userController;
