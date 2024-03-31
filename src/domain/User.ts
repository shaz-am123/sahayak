class User {
    id: string | null;
    name: string;
    emailAddress: string;
    username: string;
    hashedPassword: string;

    constructor(data: {id: string | null, name: string, emailAddress: string, username: string, hashedPassword: string}) {
        this.id = data.id;
        this.name = data.name;
        this.emailAddress = data.emailAddress;
        this.username = data.username;
        this.hashedPassword = data.hashedPassword;
    }
}

export default User