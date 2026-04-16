import { createClient } from 'redis';
import config from './config.js';

const redisClient = createClient({
    url: config.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Max retries reached');
            return Math.min(retries * 100, 3000); // Retry every 3 seconds
        },
        keepAlive: 5000, // Keep the connection active
    }
});

// CRITICAL: This listener prevents the "Unhandled 'error' event" crash
redisClient.on('error', (err) => {
    console.error('Redis Connection Error:', err);
});

redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('ready', () => console.log('Redis Client Ready'));

try {
    await redisClient.connect();
} catch (err) {
    console.error('Initial Redis connection failed:', err);
}

export default redisClient;
