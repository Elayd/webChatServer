import supertest from 'supertest';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { app } from '../..';
import { getUserByEmail } from '../../api/getUserByEmail';
import { CustomErrorCodes } from '../../enums/customErrorCodes';

jest.mock('../../api/getUserByEmail');
jest.mock('../../api/createUser');

const user = {
    _id: '6717f34c35b7547cde63221e',
    email: 'testtest@test.com',
    typeAuth: 'common',
    password: 'password'
};

describe('Signup Controller test unit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('User already exist', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(user);

        const response = await supertest(app)
            .post('/api/security/signup')
            .send({ email: 'testtest@test.com', password: 'password' });

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(response.body).toHaveProperty('code', CustomErrorCodes.USER_ALREADY_EXISTS);
    });
});
