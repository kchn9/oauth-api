interface VerifiedToken {
    id: string;
    valid: boolean;
    userId: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
    iat: number;
    exp: number;
}

export default VerifiedToken;
