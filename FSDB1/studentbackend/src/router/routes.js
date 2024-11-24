import express from 'express';
import { Signup,login,addBlog,getBlogs,editBlog ,deleteBlog} from '../controller/studentcontroller.js';
const router = express.Router();

router.post('/signup',Signup );  // ✅
router.post('/login',login );  // ✅
router.post('/addBlog',addBlog );  // ✅
router.post('/getBlogs',getBlogs );  // ✅
router.post('/editBlog',editBlog );  // ✅
// router.post('/editstatus',editStatus );  // ✅
router.post('/deleteBlog',deleteBlog );  // ✅

export default router;



