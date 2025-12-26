import express from 'express';
import isAuthenticated from '../middleware/isAuth';
import { CreateBlog } from '../controllers/blog.controller';
import uploadFile from '../middleware/multer.middleware';

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
    res.send('Blog Home Page');
});

BlogRouter.post('/create', isAuthenticated, uploadFile, CreateBlog);

export default BlogRouter;