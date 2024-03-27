import { IsNotEmpty } from "class-validator";

class LoginRequest {
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    constructor(username: string, password: string)
    {
        this.username = username;
        this.password = password;
    }
}

export default LoginRequest