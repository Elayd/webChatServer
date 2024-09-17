import queryString from "query-string";
import { config } from "../config.js";

export const authParams = queryString.stringify({
  client_id: config.GOOGLE_CLIENT_ID,
  redirect_uri: config.REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

export const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.GOOGLE_CLIENT_ID,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.REDIRECT_URI,
  });
