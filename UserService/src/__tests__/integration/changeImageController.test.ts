import supertest from 'supertest'
import { app } from '../..'
import HttpStatusCode from '../../enums/httpStatusCodes'
import mongoose from 'mongoose'
import User from '../../models/user'
import { ObjectId } from 'mongodb'

describe('Change image controller intergration', () => {
    it('Successed change image case', async () => {
        const testedUser = {
            email: 'testbox_test12313313213131@mail.ru',
            password: 'testpassword',
            typeAuth: 'common',
            firstName: 'testbox_test',
            secondName: '',
            fullName: '',
            picture: ''
        }
        await User.deleteOne({ email: testedUser.email })
        const testedMongodbUser = await User.create(testedUser)
        const userData = { userId: testedMongodbUser._id.toString(), picture: 'testurl' }

        const response = await supertest(app).put('/api/user/changeUserAvatar').send(userData)

        const updatedUser = await User.findOne({ _id: new ObjectId(testedMongodbUser._id) })

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(updatedUser?.picture).toBe(userData.picture)

        await User.deleteOne({ _id: testedMongodbUser._id })
    })
})

afterAll(() => {
    mongoose.disconnect()
})
