import supertest from 'supertest';
import { app } from '../..';
import HttpStatusCode from '../../enums/httpStatusCodes';
import mongoose from 'mongoose';
import User from '../../models/user';

describe('Create user controller intergration', () => {
    it('Create user with common user data', async () => {
        const authData = {
            email: 'test_boxem12ail@mail.ru',
            password: 'hashedPassword',
            typeAuth: 'common'
        };
        const expectedUser = {
            email: authData.email,
            password: authData.password,
            typeAuth: 'common',
            firstName: authData.email.split('@')[0],
            secondName: '',
            fullName: '',
            picture: ''
        };

        await User.deleteOne({ email: authData.email });

        const response = await supertest(app).post('/api/serverside/user/createUser').send(authData);

        expect(response.body).toMatchObject(expectedUser);
        expect(response.status).toBe(HttpStatusCode.CREATED);

        await User.deleteOne({ email: authData.email });
    });

    it('Create user with google user data', async () => {
        const authData = {
            email: 'test_boxem12ail@gmail.com',
            password: 'hashedPassword',
            typeAuth: 'google',
            given_name: 'test_given_name',
            family_name: 'test_family_name',
            name: 'test_name',
            picture: 'test_picture'
        };

        const expectedUser = {
            email: authData.email,
            typeAuth: 'google',
            firstName: authData.given_name,
            secondName: authData.family_name,
            fullName: authData.name,
            picture: authData.picture
        };

        await User.deleteOne({ email: authData.email });

        const response = await supertest(app).post('/api/serverside/user/createUser').send(authData);

        expect(response.body).toMatchObject(expectedUser);
        expect(response.status).toBe(HttpStatusCode.CREATED);

        await User.deleteOne({ email: authData.email });
    });
});

afterAll(() => {
    mongoose.disconnect();
});
