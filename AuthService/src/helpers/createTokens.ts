import jwt from 'jsonwebtoken';

export const createTokens = (userId: string) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_PRIVATE_KEY!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'RS256'
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });
    return { accessToken, refreshToken };
};
