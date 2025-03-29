import supertest from 'supertest';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { app } from '../..';
import { getOAuthToken } from '../../api/getOAuthToken';

jest.mock('../../api/getOAuthToken');

describe('Exchange Token Controller test unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Exchange token with no id token', async () => {
    (getOAuthToken as jest.Mock).mockResolvedValue(null);

    const response = await supertest(app).get('/api/oauth/token?code=test');

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
