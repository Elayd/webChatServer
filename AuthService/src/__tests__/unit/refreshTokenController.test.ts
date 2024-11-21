import supertest from 'supertest';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { app } from '../..';

describe('LogoutAll controller test unit', () => {
    it('Logout with wrong token', async () => {
        await supertest(app)
            .post('/api/security/refresh')
            .send({ refreshToken: 'test' })
            .expect(HttpStatusCode.FORBIDDEN);
    });
});
