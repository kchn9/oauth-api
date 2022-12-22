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

    public refresh = async (refreshToken: string): Promise<string | false> => {
        try {
            const extractedRefreshToken = this.jwtUtils.verify(refreshToken);
            if (typeof extractedRefreshToken === "string") return false;

            const session = await this.dbClient.session.findUnique({
                where: {
                    id: extractedRefreshToken.id,
                },
            });
            if (!session) return false;

            const user = await this.userService.find({
                id: session.userId,
            });
            if (!user) return false;

            const newAccessToken = this.jwtUtils.sign(session, {
                expiresIn: this.tokenConfig.accessTokenTtl,
            });

            return newAccessToken;
        } catch (e) {
            throw e;
        }
    };

    /**
     *
     */
    public invalidate = async (sessionId: string): Promise<void> => {
        try {
            const session = await this.dbClient.session.findUnique({
                where: { id: sessionId },
            });
            if (!session) {
                throw new HttpError(404, "Session not found");
            }
            if (!session.valid) {
                throw new HttpError(400, "Session invalid");
            }
            await this.dbClient.session.update({
                where: {
                    id: session.id,
                },
                data: {
                    valid: false,
                },
            });
        } catch (e) {
            throw e;
        }
    };

    public isValid = async (sessionId: string): Promise<boolean> => {
        try {
            const session = await this.dbClient.session.findUnique({
                where: { id: sessionId },
            });
            if (!session) {
                return false;
            }
            return session.valid;
        } catch (e) {
            throw e;
        }
    };
}

export default SessionService;
