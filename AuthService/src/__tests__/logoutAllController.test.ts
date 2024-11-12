import { createTokens } from './../helpers/createTokens'
import supertest from 'supertest'
import { app, redisClient, server } from '..'

describe('LogoutAll controller test', () => {
    it('LogoutAll with wrong refresh token', async () => {
        await supertest(app).post('/api/security/logoutOtherDevices').send({ refreshToken: 'test' }).expect(500)
    })

    it('Logout without refresh token', async () => {
        await supertest(app).post('/api/security/logoutOtherDevices').send().expect(500)
    })

    it('Logout with valid refresh token', async () => {
        const { refreshToken } = createTokens('6717f34c35b7547cde63221e')
        await supertest(app).post('/api/security/logoutOtherDevices').send({ refreshToken }).expect(200)
    })
})

afterAll((done) => {
    redisClient.disconnect()
    server.close(done)
})
