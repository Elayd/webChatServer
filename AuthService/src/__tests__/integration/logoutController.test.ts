import supertest from 'supertest';
import { app, redisClient } from '../..';
import { createTokens } from '../../helpers/createTokens';
import HttpStatusCode from '../../enums/httpStatusCodes';

describe('Logout controller test intergration', () => {
  it('Logout with valid refresh token', async () => {
    const { refreshToken } = createTokens('6717f34c35b7547cde63221e');

    await supertest(app).post('/api/security/logout').send({ refreshToken }).expect(HttpStatusCode.OK);
  });
});

afterAll(async () => {
  await redisClient.disconnect();
});
