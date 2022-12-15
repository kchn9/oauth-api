import { PrismaClient, Session } from "@prisma/client";
import { HttpError } from "../interfaces/errors/HttpError.interface";
import JwtUtils from "../utils/jwt.utils";
import { CreateSessionBody } from "../validators/session.validation";
import argon2, { argon2i } from "argon2";
import config from "config";
import UserService from "./user.service";

class SessionService {
    private dbClient: PrismaClient = new PrismaClient();
    private userService: UserService = new UserService();
    private jwtUtils: JwtUtils = new JwtUtils();
    private tokenConfig: { accessTokenTtl: string; refreshTokenTtl: string };

    constructor() {
        const { accessTokenTtl, refreshTokenTtl } = config.get<{
            accessTokenTtl: string;
            refreshTokenTtl: string;
        }>("jwt");
        this.tokenConfig = {
            accessTokenTtl,
            refreshTokenTtl,
        };
    }

    /**
     * Creates new user session, generates jwt access token and 'x-refresh' token
     * @param {CreateSessionBody} credentials user's username & password
     */
    public create = async (
        credentials: CreateSessionBody,
        userAgent?: string
    ): Promise<[string, string]> => {
        try {
            // find user
            const user = await this.userService.find({
                username: credentials.username,
            });
            // compare password
            const isValid = user
                ? await argon2.verify(user.password, credentials.password, {
                      type: argon2i,
                  })
                : false;
            if (!isValid || !user) {
                throw new HttpError(
                    401,
                    "Invalid username/password combination"
                );
            }
            // create session
            const session: Session = await this.dbClient.session.create({
                data: {
                    userId: user.id,
                    userAgent,
                },
            });

            // create token and refresh token
            const accessToken = this.jwtUtils.sign(session, {
                expiresIn: this.tokenConfig.accessTokenTtl,
            });
            const refreshToken = this.jwtUtils.sign(session, {
                expiresIn: this.tokenConfig.refreshTokenTtl,
            });

            return [accessToken, refreshToken];
        } catch (e) {
            throw e;
        }
    };
}

export default SessionService;
