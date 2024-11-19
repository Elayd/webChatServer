type BaseUser = {
    _id: string
    email: string
    firstName: string
    secondName: string
    fullName: string
    picture: string
    __v: number
}

export type User =
    | (BaseUser & { typeAuth: 'common'; password: string })
    | (BaseUser & { typeAuth: 'google'; password?: never })
