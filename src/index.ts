import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import dotenv from 'dotenv';
import compression from "compression"
import session from "express-session"
import passport from "passport"
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
import { app, server } from './chat/server';
import { notificationRouter } from './routes/notificationRoutes';
import { chatRouter } from './routes/chatRoutes';
import { passwordRouter } from './routes/passwordRoutes';
import { usePassportGoogle } from './middlewares/passportOuth';
import { deleteOldNotifications } from './controllers/notificationControllers';
import { reportsRouter } from './routes/reportsRoutes';

dotenv.config();

// const app = express();
dbConnect()
syncDB()
redisDB()
usePassportGoogle()
setInterval(deleteOldNotifications, 24 * 60 * 60 * 1000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [ process.env.FRONTEND_URL as string , "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression())
app.use(helmet({xFrameOptions: { action: "deny" }}));
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
}));
app.use(errorHandler)
app.use(session({
    secret: process.env.SESSION_SCRET_KEY as string,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/post', postsRouter)
app.use('/api/v1/wishlist', wishlistRouter)
app.use('/api/v1/doctor', doctorRouter)
app.use('/api/v1/appointment', appointmentRouter)
app.use('/api/v1/review', reviewsRouter)
app.use('/api/v1/notification', notificationRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/password', passwordRouter)
app.use('/api/v1/report', reportsRouter)

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "this resource is not found" });
});

server.listen(process.env.PORT,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT}`)
})