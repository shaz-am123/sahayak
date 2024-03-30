class RegistrationResponse {
  id: string;
  name: string;
  emailAddress: string;
  username: string;

  constructor(id: string, name: string, emailAddress: string, username: string) {
    this.id = id;
    this.name = name;
    this.emailAddress = emailAddress;
    this.username = username;
  }
}

export default RegistrationResponse;
