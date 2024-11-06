import axios from 'axios'
import { User } from '../types/userdb'

type CommonAuthRequest = {
    email: string
    password: string
    typeAuth: 'common'
}

type GoogleAuthRequest = {
    email: string
    typeAuth: 'google'
    firstName: string
    secondName: string
    fullName: string
    picture: string
}

type CreateUserRequest = CommonAuthRequest | GoogleAuthRequest
export const createUser = async (data: CreateUserRequest): Promise<User> => {
    const { data: user } = await axios.post(`${process.env.USER_SERVICE_BASE_URL}/createUser`, data)
    return user
}
