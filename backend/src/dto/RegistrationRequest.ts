import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  validate,
} from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";

class RegistrationRequest {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Email address is required" })
  @IsEmail({}, { message: "Invalid email address" })
  emailAddress: string;

  @IsNotEmpty({ message: "Username is required" })
  @MinLength(4, { message: "Username must be at least 4 characters long" })
  @MaxLength(30, { message: "Username must be at most 20 characters long" })
  username: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  )
  password: string;

  constructor(data: {
    name: string;
    emailAddress: string;
    username: string;
    password: string;
  }) {
    this.name = data.name;
    this.emailAddress = data.emailAddress;
    this.username = data.username;
    this.password = data.password;
  }
}

export default RegistrationRequest;
