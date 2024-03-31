class LoginResponse {
  id: string;
  username: string;
  token: string;

  constructor(data: {id: string, username: string, token: string}) {
    this.id = data.id;
    this.username = data.username;
    this.token = data.token;
  }
}

export default LoginResponse;
