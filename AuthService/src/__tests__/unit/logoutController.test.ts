import supertest from 'supertest';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { app } from '../..';

describe('Logout controller test units', () => {
    it('Logout with wrong refresh token', async () => {
        await supertest(app)
            .post('/api/security/logout')
            .send({ refreshToken: 'test' })
            .expect(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });

    it('Logout without refresh token', async () => {
        await supertest(app).post('/api/security/logout').send().expect(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });
});
