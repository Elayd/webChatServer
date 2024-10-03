export const config = {
    ORIGIN: 'http://localhost:8000/',
    PORT: 8000,
    JWT_SECRET: 'jwt_secret',
    JWT_EXPIRES_IN: '20s',
    JWT_REFRESH_SECRET: 'rf_jwt_secret',
    JWT_REFRESH_EXPIRES_IN: '30d',
    MONGO_URI:
        'mongodb+srv://admin:admin@webchat-1.zobxe.mongodb.net/Node-API?retryWrites=true&w=majority&appName=webchat-1',
    CSRF_SECRET: 'csrf_secret',
    GOOGLE_CLIENT_ID: '801555540524-pp7o09fa92uf4otba0ei7vp9ccpspsoe.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: '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',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    REDIRECT_URI: 'http://localhost:5173/auth/callback'
}
