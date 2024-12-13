import { Redis } from "ioredis";
import { envs } from "../../config/envs";



export const redis = new Redis(envs.REDIS_URL);

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redis.on("connect", () => {
    console.log("Redis connection established");
});