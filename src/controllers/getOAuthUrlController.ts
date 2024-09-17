import { config } from '../config'
import { authParams } from '../helpers/oauth'

export const getOAuthUrlController = (_, res) => {
    res.json({
        url: `${config.authUrl}?${authParams}`
    })
}
