import supertest from 'supertest';
import { app } from '../..';
import HttpStatusCode from '../../enums/httpStatusCodes';
import mongoose from 'mongoose';
import User from '../../models/user';
import { ObjectId } from 'mongodb';

describe('Change user info controller intergration', () => {
    it('Successed change info case', async () => {
        const testedUser = {
            email: 'testbox_test12313313213131@mail.ru',
            password: 'testpassword',
            typeAuth: 'common',
            firstName: 'testbox_test',
            secondName: '',
            fullName: '',
            picture: ''
        };
        await User.deleteOne({ email: testedUser.email });
        const testedMongodbUser = await User.create(testedUser);
        const userData = { userId: testedMongodbUser._id.toString(), firstName: 'test', secondName: 'test' };

        const response = await supertest(app).put('/api/user/changeUserInfo').send(userData);

        const updatedUser = await User.findOne({ _id: new ObjectId(testedMongodbUser._id) });

        expect(response.status).toBe(HttpStatusCode.OK);
        expect(updatedUser?.firstName).toBe(userData.firstName);
        expect(updatedUser?.secondName).toBe(userData.secondName);

        await User.deleteOne({ _id: testedMongodbUser._id });
    });
});

afterAll(() => {
    mongoose.disconnect();
});
