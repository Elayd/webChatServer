import supertest from 'supertest';
import { app } from '../..';
import HttpStatusCode from '../../enums/httpStatusCodes';
import mongoose from 'mongoose';
import User from '../../models/user';

describe('Get user by email controller intergration', () => {
    it('Get user by email with common user data', async () => {
        const queryData = {
            email: 'test_boxem12ail@mail.ru'
        };
        await User.deleteOne({ email: queryData.email });
        const expectedUser = {
            email: queryData.email,
            password: 'testpassword',
            typeAuth: 'common',
            firstName: queryData.email.split('@')[0],
            secondName: '',
            fullName: '',
            picture: ''
        };
        await User.create(expectedUser);

        const response = await supertest(app)
            .get('/api/serverside/user/getUserByEmail')
            .query({ email: queryData.email });

        expect(response.body).toMatchObject(expectedUser);
        expect(response.status).toBe(HttpStatusCode.OK);

        await User.deleteOne({ email: queryData.email });
    });
    it('Get user by email with google user data', async () => {
        const queryData = {
            email: 'test_boxem12ail@gmail.com'
        };
        await User.deleteOne({ email: queryData.email });
        const expectedUser = {
            email: queryData.email,
            typeAuth: 'google',
            firstName: 'test_firstname',
            secondName: 'test_secondname',
            fullName: 'test_fullname',
            picture: 'testurl'
        };
        await User.create(expectedUser);

        const response = await supertest(app)
            .get('/api/serverside/user/getUserByEmail')
            .query({ email: queryData.email });

        expect(response.body).toMatchObject(expectedUser);
        expect(response.status).toBe(HttpStatusCode.OK);

        await User.deleteOne({ email: queryData.email });
    });
    it('Get user by email with no user in db', async () => {
        const queryData = {
            email: 'test_boxem12ail111@gmail.com'
        };
        await User.deleteOne({ email: queryData.email });

        const response = await supertest(app)
            .get('/api/serverside/user/getUserByEmail')
            .query({ email: queryData.email });

        expect(response.body).toBe(null);
        expect(response.status).toBe(HttpStatusCode.OK);
    });
});

afterAll(() => {
    mongoose.disconnect();
});
