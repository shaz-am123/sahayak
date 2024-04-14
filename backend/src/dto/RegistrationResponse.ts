class RegistrationResponse {
  id: string;
  name: string;
  emailAddress: string;
  username: string;

  constructor(data: {
    id: string;
    name: string;
    emailAddress: string;
    username: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.emailAddress = data.emailAddress;
    this.username = data.username;
  }
}

export default RegistrationResponse;
