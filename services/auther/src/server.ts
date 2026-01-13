import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { initDB } from './utils/DataBase';
import BlogRouter from './routes/blog.routes';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import { connectRabbitMQ } from './utils/rabbitmq.js';

dotenv.config();

const app = express();

connectRabbitMQ();

const PORT = process.env.PORT || 5001;

const apiVersion = 'v1';

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API,
    api_secret: process.env.API_Secret,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Auther Service is up and running on port number ' + PORT + '!');
})

app.use(`/api/${apiVersion}/blog`, BlogRouter);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Auther Server is running on port ${PORT} ->  "http://localhost:${PORT}"`);
    })
})