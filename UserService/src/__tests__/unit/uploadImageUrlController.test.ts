import supertest from 'supertest';
import { app } from '../..';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import HttpStatusCode from '../../enums/httpStatusCodes';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn()
}));

process.env.AWS_BUCKET_NAME = 'mock-bucket';
process.env.AWS_BUCKET_URL = 'https://mock-bucket-url';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY = 'mock-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'mock-secret-key';

describe('uploadImageUrlController unit test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return a signed URL when file upload is successful', async () => {
    const mockUrl = 'https://mock-s3-url.com/mock-key';

    (getSignedUrl as jest.Mock).mockResolvedValue(mockUrl);

    const userId = 'user123';
    const fileType = 'image/jpeg';

    const response = await supertest(app).get('/api/user/uploadImageUrl').query({ userId, fileType });

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body.url).toBe(mockUrl);
    expect(response.body.key).toMatch(`${userId}/`);
    expect(response.body.key).toMatch(/\.[a-z]+$/);
  });
});
