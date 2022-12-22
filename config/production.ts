import "dotenv/config";

export default {
    server: {
        port: 8080,
    },
    jwt: {
        publicKey:
            "-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgE8I6r0xxXXUcn9nR4p5Xuxd1LM0\nd2cHrjp8bEOO6/8rQjKPLObunuoTQA68uN7JACXbSO5DUNLVF8tTGagqWZWXWXsj\ny+D4xooaC4XQ3nMgoGTLwGhvFYW+NmNT3iAOrhJ+uhm3dEQZgpPOr+wjo5Bb9/QF\nTGtXMI0Mf+iLNDclAgMBAAE=\n-----END PUBLIC KEY-----",
        privateKey: process.env.RSA_PRIVATE_KEY,
        accessTokenTtl: "15m",
        refreshTokenTtl: "1y",
    },
    smtp: {
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.GMAIL_SMTP_USER,
            pass: process.env.GMAIL_SMTP_PASS,
        },
        sender: process.env.GMAIL_SMTP_USER,
    },
};
