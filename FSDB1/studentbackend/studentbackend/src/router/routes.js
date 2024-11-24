// import express from 'express';
// import { Signup,login,addBlog,getBlogs,editBlog ,deleteBlog} from '../controller/studentcontroller.js';
// const router = express.Router();

// router.post('/signup',Signup );  // ✅
// router.post('/login',login );  // ✅
// router.post('/addBlog',addBlog );  // ✅
// router.post('/getBlogs',getBlogs );  // ✅
// router.post('/editBlog',editBlog );  // ✅
// // router.post('/editstatus',editStatus );  // ✅
// router.post('/deleteBlog',deleteBlog );  // ✅

// export default router;

import express from 'express';
import { addBlog, editBlog, deleteBlog, getBlogs,Signup,login} from '../controller/studentcontroller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', login);
// Add Blog Post
router.post('/add', addBlog);

// Edit Blog Post
router.post('/edit/:postId', editBlog);

// Delete Blog Post
router.post('/delete/:postId', deleteBlog);

// Get Blog Post
router.post('/:postId', getBlogs);

export default router;


