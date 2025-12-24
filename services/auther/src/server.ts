import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { initDB } from './utils/DataBase';
import BlogRouter from './routes/blog.routes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Auther Service is up and running on port number ' + PORT + '!');
})

app.use('/blog', BlogRouter);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Auther Server is running on port ${PORT} ->  "http://localhost:${PORT}"`);
    })
})