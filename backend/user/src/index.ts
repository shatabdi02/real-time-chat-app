import express from "express";
import dotenv from 'dotenv';
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoutes from './routes/user.js';
import { connectRabbitMQ } from "./config/rabbitmq.js";


dotenv.config();

/* -------- ENV VALIDATION -------- */
const port = process.env.PORT;
const REDIS_URL = process.env.REDIS_URL;

if (!port) {
  throw new Error("PORT is not defined in .env");
}

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in .env");
}
/* -------------------------------- */

connectDb();

connectRabbitMQ();

export const redisClient= createClient({
    url: REDIS_URL,
});

redisClient
.connect()
.then(() =>console.log("Connected to redis"))
.catch((err)=>{
    console.error("Redis connection failed", err);
    process.exit(1);
});

const app = express();

app.use(express.json());


app.use("/api/v1",userRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});