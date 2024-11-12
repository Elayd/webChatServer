import { getOAuthToken } from './../api/getOAuthToken'
import supertest from 'supertest'
import { app, redisClient, server } from '..'
import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../api/getUserByEmail'
import HttpStatusCode from '../enums/httpStatusCodes'
import { createUser } from '../api/createUser'

jest.mock('../api/getUserByEmail')
jest.mock('../api/getOAuthToken')
jest.mock('../api/createUser')

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

describe('Exchange Token Controller test', () => {
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

    it('Exchange token with no id token', async () => {
        const _ = (getOAuthToken as jest.Mock).mockResolvedValue(null)

        const response = await supertest(app).get('/api/oauth/token?code=test')

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
    })
})

afterAll((done) => {
    server.close(done)
    redisClient.disconnect()
})
