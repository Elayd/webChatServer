export const getTokenParams = (code: string) => {
  return {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.REDIRECT_URI
  };
};

export type OAuthTokenParams = {
  client_id?: string;
  client_secret?: string;
  code?: string;
  grant_type?: string;
  redirect_uri?: string;
};
