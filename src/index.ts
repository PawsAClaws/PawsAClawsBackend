import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import dotenv from 'dotenv';
import compression from "compression"
import { dbConnect, syncDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { postsRouter } from './routes/postsRoutes';
import { wishlistRouter } from './routes/wishlistRoutes';
import { redisDB } from './config/redisClient';
import { doctorRouter } from './routes/doctorRoutes';
import { appointmentRouter } from './routes/appointmentRoutes';
import { reviewsRouter } from './routes/reviewsRoutes';

dotenv.config();

const app = express();
dbConnect()
syncDB()
redisDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression())
app.use(helmet({xFrameOptions: { action: "deny" }}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
}));
app.use(errorHandler)


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/post', postsRouter)
app.use('/api/v1/wishlist', wishlistRouter)
app.use('/api/v1/doctor', doctorRouter)
app.use('/api/v1/appointment', appointmentRouter)
app.use('/api/v1/review', reviewsRouter)

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "this resource is not found" });
});

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT}`)
})