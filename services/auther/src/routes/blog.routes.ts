import express from 'express';

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
    res.send('Blog Home Page');
});

export default BlogRouter;