import {
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  validate,
} from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";

class LoginRequest {
  @IsNotEmpty({ message: "Username is required" })
  username: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  constructor(data: { username: string; password: string }) {
    this.username = data.username;
    this.password = data.password;
  }
}

export default LoginRequest;
