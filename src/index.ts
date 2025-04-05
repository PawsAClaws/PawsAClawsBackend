import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import dotenv from 'dotenv';
import compression from "compression"
import { dbConnect, syncDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { authRouter } from './routes/authRoutes';

dotenv.config();

const app = express();
dbConnect()
syncDB()

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

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "this resource is not found" });
});

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT}`)
})