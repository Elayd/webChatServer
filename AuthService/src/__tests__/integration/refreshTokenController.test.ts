import supertest from 'supertest';
import { redisClient, app } from '../..';
import { createTokens } from '../../helpers/createTokens';
import HttpStatusCode from '../../enums/httpStatusCodes';

describe('LogoutAll controller test intergration', () => {
    it('LogoutAll with good refresh token', async () => {
        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10);
        const { refreshToken } = createTokens('6717f34c35b7547cde63221e');
        await redisClient.setToken('6717f34c35b7547cde63221e', refreshToken, expiredIn);

        const response = await supertest(app).post('/api/security/refresh').send({ refreshToken });

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(response.body).toHaveProperty('accessToken');
    });
});

afterAll(async () => {
    await redisClient.disconnect();
});
