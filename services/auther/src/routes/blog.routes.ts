import express from 'express';
import isAuthenticated from '../middleware/isAuth';
import { AddComment, CreateBlog, DeleteBlog, DeleteDraft, GetCommentsByBlog, GetLikeStatus, GetMyDrafts, SaveDraft, ToggleLike, UpdateBlog, UploadContentImages } from '../controllers/blog.controller';
import uploadFile, { uploadContentImages } from '../middleware/multer.middleware';

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
    res.send('Blog Home Page');
});

BlogRouter.post('/create', isAuthenticated, uploadFile, CreateBlog);
BlogRouter.put('/update/:id', isAuthenticated, uploadFile, UpdateBlog);
BlogRouter.delete('/delete/:id', isAuthenticated, DeleteBlog);
BlogRouter.post('/like/:blogId', isAuthenticated, ToggleLike);
BlogRouter.get('/like/:blogId/status', isAuthenticated, GetLikeStatus);
BlogRouter.post('/comment/:blogId', isAuthenticated, AddComment);
BlogRouter.get('/comment/:blogId', GetCommentsByBlog);
BlogRouter.post('/draft/save', isAuthenticated, SaveDraft);
BlogRouter.get('/draft/my', isAuthenticated, GetMyDrafts);
BlogRouter.delete('/draft/:id', isAuthenticated, DeleteDraft);
BlogRouter.post('/content-images/upload', isAuthenticated, uploadContentImages, UploadContentImages);

export default BlogRouter;