import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { getUserByEmail } from '../../api/getUserByEmail';
import { app, redisClient } from '../..';

jest.mock('../../api/getUserByEmail');

describe('Signin Controller test intergration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Successful signin', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = {
      _id: '6717f34c35b7547cde63221e',
      email: 'testtest@test.com',
      typeAuth: 'common',
      password: hashedPassword
    };
    (getUserByEmail as jest.Mock).mockResolvedValue(user);

    const response = await supertest(app)
      .post('/api/security/signin')
      .send({ email: 'testtest@test.com', password: 'password' });

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('userId', user._id);
  });
});

afterAll(async () => {
  await redisClient.disconnect();
});
