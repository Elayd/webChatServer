import axios from 'axios'
import { OAuthTokenParams } from '../helpers/oauth'

export const getOAuthToken = async (tokenParam: OAuthTokenParams) => {
    const {
        data: { id_token }
    } = await axios.post(`${process.env.TOKEN_URL}`, tokenParam)
    return id_token
}
