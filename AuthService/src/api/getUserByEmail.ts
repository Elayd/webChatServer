import axios from 'axios';
import { User } from '../types/userdb';

export const getUserByEmail = async (email: string): Promise<User> => {
    const { data: user } = await axios.get<User>(`${process.env.USER_SERVICE_BASE_URL}/getUserByEmail`, {
        params: { email }
    });
    return user;
};
