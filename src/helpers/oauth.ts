import { config } from '../config'

export const getTokenParams = (code: string) => {
    return {
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.REDIRECT_URI
    }
}
