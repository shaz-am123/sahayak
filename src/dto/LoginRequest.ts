import { IsNotEmpty, Matches, MaxLength, MinLength, validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";

class LoginRequest {
    @IsNotEmpty({ message: "Username is required" })
    username: string;
  
    @IsNotEmpty({ message: "Password is required" })
    password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  async validateRequest() {
    const validationErrors = await validate(this);
    if (validationErrors.length > 0) {
      throw new CustomValidationError("Validation error: ", validationErrors);
    }
  }
}

export default LoginRequest;
