import config from "config";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { logger } from "./logger.utils";

class Mailer {
    private transporter: Transporter;
    private sender: string;

    constructor() {
        if (process.env.NODE_ENV === "production") {
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
        } else {
            this.transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "lemuel.raynor98@ethereal.email",
                    pass: "uuDwKr8DcAnuRzFaC6",
                },
            });
            this.sender = "lemuel.raynor98@ethereal.email";
        }
    }

    private sendMessage = async (payload: SendMailOptions): Promise<any> => {
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
            if (process.env.NODE_ENV !== "production") {
                const { port } = config.get<{ port: number }>("server");
                const info = await this.sendMessage({
                    from: this.sender,
                    to: targetEmail,
                    subject: "Confirm your account",
                    html: `<h2>Confirm your account</h2>
                           <p>Welcome to notes app, ${targetUsername}!</p>
                           <p>Simply click following link to verify your account:</p>
                           <a href=\"http:localhost:${port}/api/users/verify/${targetId}&${verificationCode}\">Verify account</a>
                           <p>Your confirmation code:</p>
                           <code>${verificationCode}</code>`,
                });
                logger.info(nodemailer.getTestMessageUrl(info));
            } else {
                await this.sendMessage({
                    from: this.sender,
                    to: targetEmail,
                    subject: "Confirm your account",
                    html: `<h2>Confirm your account</h2>
                           <p>Welcome to notes app, ${targetUsername}!</p>
                           <p>Simply click following link to verify your account:</p>
                           <a href=\"https://kchn9-auth-api.fly.dev/api/users/verify/${targetId}&${verificationCode}\">Verify account</a>
                           <p>Your confirmation code:</p>
                           <code>${verificationCode}</code>`,
                });
            }
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
            if (process.env.NODE_ENV !== "production")
                logger.info(nodemailer.getTestMessageUrl(info));
        } catch (e) {
            logger.error(e);
        }
    };
}

export default Mailer;
