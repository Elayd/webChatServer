import supertest from 'supertest'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { app } from '../..'

describe('LogoutAll controller test units', () => {
    it('LogoutAll with wrong refresh token', async () => {
        await supertest(app)
            .post('/api/security/logoutOtherDevices')
            .send({ refreshToken: 'test' })
            .expect(HttpStatusCode.INTERNAL_SERVER_ERROR)
    })

    it('Logout without refresh token', async () => {
        await supertest(app)
            .post('/api/security/logoutOtherDevices')
            .send()
            .expect(HttpStatusCode.INTERNAL_SERVER_ERROR)
    })
})
