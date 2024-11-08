import supertest from 'supertest'
import { app, server } from '..'

describe('Logout controller test', () => {
    it('Successful logout', async () => {
        await supertest(app).post('/api/security/logout').send({ refreshToken: 'test' }).expect(500)
    })

    it('Failed logout', async () => {
        await supertest(app).post('/api/security/logout').send().expect(500)
    })
})

afterAll((done) => {
    server.close(done)
})
