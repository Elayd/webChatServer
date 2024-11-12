import jwt from 'jsonwebtoken'
import supertest from 'supertest'
import { app, redisClient, server } from '..'
import HttpStatusCode from '../enums/httpStatusCodes'

describe('LogoutAll controller test', () => {
    it('LogoutAll with good refresh token', async () => {
        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
        const refreshToken = jwt.sign({ id: '6717f34c35b7547cde63221e' }, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        })
        await redisClient.setToken('6717f34c35b7547cde63221e', refreshToken, expiredIn)

        const response = await supertest(app).post('/api/security/refresh').send({ refreshToken })

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('accessToken')
    })

    it('Logout with wrong token', async () => {
        await supertest(app).post('/api/security/refresh').send({ refreshToken: 'test' }).expect(403)
    })
})

afterAll((done) => {
    server.close(done)
    redisClient.disconnect()
})
