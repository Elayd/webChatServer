import Redis, { Redis as RedisClientType } from 'ioredis';

export class RedisClient {
    private client: RedisClientType;

    constructor(url: string) {
        this.client = new Redis(url, {
            // lazyConnect: true
        });

        // this.client.on('error', (err) => {
        //     console.error('Redis error:', err)
        // })
    }

    async deleteToken(userId: string, token: string): Promise<number> {
        const key = `${userId}:${token}`;
        // await this.client.connect()
        const result = await this.client.del(key);
        // this.client.disconnect()
        return result;
    }

    async tokenExist(userId: string, token: string): Promise<number> {
        const key = `${userId}:${token}`;
        // await this.client.connect()
        const result = await this.client.exists(key);
        // this.client.disconnect()
        return result;
    }

    async setToken(userId: string, token: string, expiredIn: number): Promise<void> {
        const key = `${userId}:${token}`;
        // await this.client.connect()
        await this.client.set(key, process.env.JWT_REFRESH_EXPIRES_IN!, 'EX', expiredIn);
        // this.client.disconnect()
    }

    async deleteAllTokensExlCurrent(userId: string, token: string): Promise<number> {
        const currentKey = `${userId}:${token}`;
        // await this.client.connect()
        const keys = await this.client.keys(`${userId}:*`);
        const keysToDelete = keys.filter((key) => key !== currentKey);
        if (keysToDelete.length === 0) {
            // this.client.disconnect()
            return 0;
        }
        const deleteCount = await this.client.del(...keysToDelete);
        // this.client.disconnect()
        return deleteCount;
    }

    async disconnect() {
        this.client.disconnect();
    }
}

export default RedisClient;
