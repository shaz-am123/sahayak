class LoginResponse {
  id: string;
  username: string;
  token: string;

  constructor(id: string, username: string, token: string) {
    this.id = id;
    this.username = username;
    this.token = token;
  }
}

export default LoginResponse;
