export class LoginUser {
    public userName! : string;
    public password! : string;

    setCredential(userName: string, password: string): boolean {
        if(!this.validateUserName(userName)) {
            return false;
        }

        if(!this.validatePasswrod(userName)) {
            return false;
        }

        this.userName = userName;
        this.password = password;

        return true;
    }

    private validateUserName(userName: string): boolean {
        return userName !== undefined && userName !== '';
    }

    private validatePasswrod(password: string): boolean {
        return password !== undefined && password !== '';
    }
}