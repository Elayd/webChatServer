import supertest from 'supertest';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { app } from '../..';
import { getUserByEmail } from '../../api/getUserByEmail';
import { CustomErrorCodes } from '../../enums/customErrorCodes';

jest.mock('../../api/getUserByEmail');

describe('Signin Controller test unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("User doesn't exist", async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    const response = await supertest(app)
      .post('/api/security/signin')
      .send({ email: 'testtest@test.com', password: 'password' });

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toHaveProperty('code', CustomErrorCodes.USER_NOT_FOUND);
  });

  it('Not common account', async () => {
    const user = {
      _id: '6717f34c35b7547cde63221e',
      email: 'testtest@test.com',
      typeAuth: 'google',
      password: 'test'
    };
    (getUserByEmail as jest.Mock).mockResolvedValue(user);

    const response = await supertest(app)
      .post('/api/security/signin')
      .send({ email: 'testtest@test.com', password: 'test' });

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('Not Matched Password', async () => {
    const user = {
      _id: '6717f34c35b7547cde63221e',
      email: 'testtest@test.com',
      typeAuth: 'common',
      password: 'test'
    };
    (getUserByEmail as jest.Mock).mockResolvedValue(user);

    const response = await supertest(app)
      .post('/api/security/signin')
      .send({ email: 'testtest@test.com', password: 'pass' });

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
    expect(response.body).toHaveProperty('code', CustomErrorCodes.USER_INVALID_CREDENTIALS);
  });
});
