import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({
    url:process.env.REDIS_URL
})

export const redisDB = async()=>{
    redisClient.on("error", (err) => console.log("redis error"+err));
    redisClient.on("connect", () => console.log("redis connected"));
    await redisClient.connect();
    // await redisClient.ping()
}