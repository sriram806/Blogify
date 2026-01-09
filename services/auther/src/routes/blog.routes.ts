import express from 'express';
import isAuthenticated from '../middleware/isAuth';
import { CreateBlog, DeleteBlog, GetAllBlogs, UpdateBlog } from '../controllers/blog.controller';
import uploadFile from '../middleware/multer.middleware';

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
    res.send('Blog Home Page');
});

BlogRouter.get('/all', GetAllBlogs);
BlogRouter.post('/create', isAuthenticated, uploadFile, CreateBlog);
BlogRouter.put('/update/:id', isAuthenticated, uploadFile, UpdateBlog);
BlogRouter.delete('/delete/:id', isAuthenticated, DeleteBlog);

export default BlogRouter;