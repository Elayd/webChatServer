import { config } from "../config.js";
import { authParams } from "../helpers/oauth.js";

export const getOAuthUrlController = (_, res) => {
  res.json({
    url: `${config.authUrl}?${authParams}`,
  });
};
