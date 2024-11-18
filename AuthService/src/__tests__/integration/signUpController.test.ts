import supertest from 'supertest'
import { app, redisClient } from '../..'
import { createUser } from '../../api/createUser'
import { getUserByEmail } from '../../api/getUserByEmail'
import HttpStatusCode from '../../enums/httpStatusCodes'

jest.mock('../../api/getUserByEmail')
jest.mock('../../api/createUser')

const user = {
    _id: '6717f34c35b7547cde63221e',
    email: 'testtest@test.com',
    typeAuth: 'common',
    password: 'password'
}

describe('Signup Controller test integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Successful signUp', async () => {
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(null)
        const __ = (createUser as jest.Mock).mockResolvedValue(user)

        const response = await supertest(app)
            .post('/api/security/signup')
            .send({ email: 'testtest@test.com', password: 'password' })

        expect(response.status).toBe(HttpStatusCode.CREATED)
        expect(response.body).toHaveProperty('accessToken')
        expect(response.body).toHaveProperty('refreshToken')
        expect(response.body).toHaveProperty('userId', user._id)
    })
})

afterAll(async () => {
    await redisClient.disconnect()
})
