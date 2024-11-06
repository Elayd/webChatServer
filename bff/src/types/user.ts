interface CommonUser {
    _id: string
    typeAuth: 'common'
    email: string
    password: string
    __v: number
}

interface GoogleUser {
    _id: string
    typeAuth: 'google'
    email: string
    firstName: string
    secondName: string
    fullName: string
    picture: string
    __v: number
}

export type User = CommonUser | GoogleUser
