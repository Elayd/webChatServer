import supertest from 'supertest'
import { app, redisClient, server } from '..'
import { getUserByEmail } from '../api/getUserByEmail'
import bcrypt from 'bcryptjs'
import HttpStatusCode from '../enums/httpStatusCodes'

jest.mock('../api/getUserByEmail')

describe('Signin Controller test', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Successful signin', async () => {
        const hashedPassword = await bcrypt.hash('password', 10)
        const user = {
            _id: '6717f34c35b7547cde63221e',
            email: 'testtest@test.com',
            typeAuth: 'common',
            password: hashedPassword
        }
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(user)

        const response = await supertest(app)
            .post('/api/security/signin')
            .send({ email: 'testtest@test.com', password: 'password' })

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('accessToken')
        expect(response.body).toHaveProperty('refreshToken')
        expect(response.body).toHaveProperty('userId', user._id)
    })

    it("User doesn't exist", async () => {
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(null)

        const response = await supertest(app)
            .post('/api/security/signin')
            .send({ email: 'testtest@test.com', password: 'password' })

        expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED)
        expect(response.body).toHaveProperty('code', 101)
    })

    it('Not common account', async () => {
        const user = {
            _id: '6717f34c35b7547cde63221e',
            email: 'testtest@test.com',
            typeAuth: 'google',
            password: 'test'
        }
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(user)

        const response = await supertest(app)
            .post('/api/security/signin')
            .send({ email: 'testtest@test.com', password: 'test' })

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.body).toHaveProperty('message', 'Invalid credentials')
    })

    it('Not common account', async () => {
        const user = {
            _id: '6717f34c35b7547cde63221e',
            email: 'testtest@test.com',
            typeAuth: 'google',
            password: 'test'
        }
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(user)

        const response = await supertest(app)
            .post('/api/security/signin')
            .send({ email: 'testtest@test.com', password: 'test' })
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)

        expect(response.body).toHaveProperty('message', 'Invalid credentials')
    })

    it('Not Matched Password', async () => {
        const user = {
            _id: '6717f34c35b7547cde63221e',
            email: 'testtest@test.com',
            typeAuth: 'common',
            password: 'test'
        }
        const _ = (getUserByEmail as jest.Mock).mockResolvedValue(user)

        const response = await supertest(app)
            .post('/api/security/signin')
            .send({ email: 'testtest@test.com', password: 'pass' })

        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.body).toHaveProperty('message', 'Invalid credentials')
        expect(response.body).toHaveProperty('code', 103)
    })
})

// Убрать
afterAll((done) => {
    server.close(done)
    redisClient.disconnect()
})
