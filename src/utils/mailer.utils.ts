import config from "config";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { logger } from "./logger.utils";

class Mailer {
    private transporter: Transporter;
    private sender: string;

    constructor() {
        const smtp = config.get<{
            host: string;
            port: number;
            auth: { user: string; pass: string };
            sender: string;
        }>("smtp");
        this.transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: true,
            auth: smtp.auth,
        });
        this.sender = smtp.sender;
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
                from: this.sender,
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

    public sendResetMessage = async ({
        targetEmail,
        resetCode,
    }: {
        targetEmail: string;
        resetCode: string;
    }): Promise<void> => {
        try {
            const info = await this.sendMessage({
                from: this.sender,
                to: targetEmail,
                subject: "Your password recovery code",
                html: `<h2>Reset code:</h2>
                       <code>${resetCode}</code>`,
            });
            logger.info(info);
        } catch (e) {
            logger.error(e);
        }
    };
}

export default Mailer;
