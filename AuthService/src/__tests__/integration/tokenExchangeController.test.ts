import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import { app, redisClient } from '../..'
import { createUser } from '../../api/createUser'
import { getOAuthToken } from '../../api/getOAuthToken'
import { getUserByEmail } from '../../api/getUserByEmail'
import HttpStatusCode from '../../enums/httpStatusCodes'

jest.mock('../../api/getUserByEmail')
jest.mock('../../api/getOAuthToken')
jest.mock('../../api/createUser')

const googleUser = {
    _id: '123',
    typeAuth: 'google',
    email: 'test@gmail.com',
    firstName: 'test',
    secondName: 'test',
    fullName: 'test',
    picture: 'test',
    __v: 123
}

const id_token = jwt.sign(
    { email: 'test@gmail.com', given_name: 'test', family_name: 'test', name: 'test', picture: 'test' },
    'test'
)

describe('Exchange Token Controller test intergration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('Exchange token with good code with User in DB', async () => {
        const _ = (getOAuthToken as jest.Mock).mockResolvedValue(id_token)
        const __ = (getUserByEmail as jest.Mock).mockResolvedValue(googleUser)

        const response = await supertest(app).get('/api/oauth/token?code=test')

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('userId', googleUser._id)
        expect(response.body).toHaveProperty('accessToken')
        expect(response.body).toHaveProperty('refreshToken')
    })

    it('Exchange token with good code without User in DB', async () => {
        const _ = (getOAuthToken as jest.Mock).mockResolvedValue(id_token)
        const __ = (getUserByEmail as jest.Mock).mockResolvedValue(null)
        const ___ = (createUser as jest.Mock).mockResolvedValue(googleUser)

        const response = await supertest(app).get('/api/oauth/token?code=test')

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('userId', googleUser._id)
        expect(response.body).toHaveProperty('accessToken')
        expect(response.body).toHaveProperty('refreshToken')
    })
})

afterAll(async () => {
    await redisClient.disconnect()
})
