export class AuthenticationInfo {     
    token!: string;
    id!: number;
    job!: string;

    constructor(id: number, job: string, token: string) {
        this.id = id;
        this.job = job;
        this.token = token;
    }
}