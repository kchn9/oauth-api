import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

class JwtUtils {
    private privateKey: string;
    private publicKey: string;

    constructor() {
        const jwtConfig = config.get<{ publicKey: string; privateKey: string }>(
            "jwt"
        );
        this.privateKey = jwtConfig.privateKey;
        this.publicKey = jwtConfig.publicKey;
    }

    public sign = (
        payload: string | object | Buffer,
        opt?: SignOptions
    ): string => {
        return jwt.sign(payload, this.privateKey, {
            algorithm: "RS256",
            ...opt,
        });
    };

    public verify = (token: string) => {
        return jwt.verify(token, this.publicKey);
    };
}

export default JwtUtils;
