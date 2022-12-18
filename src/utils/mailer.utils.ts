import config from "config";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { logger } from "./logger.utils";

class Mailer {
    private transporter: Transporter;

    constructor() {
        const smtp = config.get<{
            host: string;
            port: number;
            auth: { user: string; pass: string };
        }>("smtp");
        this.transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: true,
            auth: smtp.auth,
        });
    }

    private sendMessage = async (payload: SendMailOptions): Promise<void> => {
        return await this.transporter.sendMail(payload);
    };

    public sendConfirmationMessage = async ({
        targetId,
        targetEmail,
        targetUsername,
        verificationCode,
    }: {
        targetId: string;
        targetEmail: string;
        targetUsername: string;
        verificationCode: string;
    }): Promise<void> => {
        try {
            const info = await this.sendMessage({
                from: "mat.kuchnia@gmail.com",
                to: targetEmail,
                subject: "Confirm your account",
                html: `<h2>Confirm your account</h2>
                       <p>Welcome to notes app, ${targetUsername}!</p>
                       <p>Simply click following link to verify your account:</p>
                       <a href=\"localhost:3001/api/users/verify/${targetId}&${verificationCode}\">Verify account</a>
                       <p>Your confirmation code:</p>
                       <code>${verificationCode}</code>`,
            });
            logger.info(info);
        } catch (e) {
            logger.error(e);
        }
    };
}

export default Mailer;
