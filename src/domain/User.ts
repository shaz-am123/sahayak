class User {
    id: string | null;
    name: string;
    username: string;
    hashedPassword: string;

    constructor(id: string | null, name: string, username: string, hashedPassword: string) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.hashedPassword = hashedPassword;
    }
}

export default User