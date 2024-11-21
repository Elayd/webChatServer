import supertest from 'supertest'
import { app } from '../..'
import HttpStatusCode from '../../enums/httpStatusCodes'
import mongoose from 'mongoose'
import User from '../../models/user'
import { ObjectId } from 'mongodb'

describe('Get user by id controller intergration', () => {
    it('Get user by id with common user data', async () => {
        const userEmail = 'test_boxem12ail@mail.ru'
        await User.deleteOne({ email: userEmail })
        const expectedUser = {
            email: userEmail,
            password: 'testpassword',
            typeAuth: 'common',
            firstName: userEmail.split('@')[0],
            secondName: '',
            fullName: '',
            picture: ''
        }
        const user = await User.create(expectedUser)

        const response = await supertest(app).get('/api/user/getUserInfo').query({ userId: user.id.toString() })

        expect(response.body).toMatchObject(expectedUser)
        expect(response.status).toBe(HttpStatusCode.OK)

        await User.deleteOne({ _id: user._id })
    })

    it('Get user by id with google user data', async () => {
        const userEmail = 'test_boxem12ail@mail.ru'
        await User.deleteOne({ email: userEmail })
        const expectedUser = {
            email: userEmail,
            typeAuth: 'google',
            firstName: 'test_firstname',
            secondName: 'test_secondname',
            fullName: 'test_fullname',
            picture: 'testurl'
        }
        const user = await User.create(expectedUser)

        const response = await supertest(app).get('/api/user/getUserInfo').query({ userId: user.id.toString() })

        expect(response.body).toMatchObject(expectedUser)
        expect(response.status).toBe(HttpStatusCode.OK)

        await User.deleteOne({ _id: user._id })
    })

    it('Get user by id with no user in db', async () => {
        const testId = '63ed2e4fb7f367c92578e526'
        await User.deleteOne({ _id: new ObjectId(testId) })

        const response = await supertest(app).get('/api/user/getUserInfo').query({ userId: testId })

        expect(response.body).toBe(null)
        expect(response.status).toBe(HttpStatusCode.OK)
    })
})

afterAll(() => {
    mongoose.disconnect()
})
