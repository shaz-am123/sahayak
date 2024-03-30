class User {
    id: string | null;
    name: string;
    emailAddress: string;
    username: string;
    hashedPassword: string;

    constructor(id: string | null, name: string, emailAddress: string, username: string, hashedPassword: string) {
        this.id = id;
        this.name = name;
        this.emailAddress = emailAddress;
        this.username = username;
        this.hashedPassword = hashedPassword;
    }
}

export default User