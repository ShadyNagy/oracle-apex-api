import jwt_decode from 'jwt-decode';

export class JwtHelper { 
    static getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
}