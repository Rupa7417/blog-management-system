import mongoose from 'mongoose';

import mongoose from 'mongoose';

// User Schema (Author)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' }, // URL or path to profile image
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// Post Schema (Blog Post)
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: String }], // Array of category names (e.g. "Technology", "Lifestyle")
    tags: [{ type: String }], // Array of tags for post filtering/searching
    image: { type: String, default: '' }, // URL or path to cover image
    published: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// Comment Schema
const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// Category Schema (Optional)
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
}, {
    timestamps: true,
});

// Tag Schema (Optional)
const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

// Export the models
export const User = mongoose.model('User', userSchema);
export const Post = mongoose.model('Post', postSchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Tag = mongoose.model('Tag', tagSchema);




import { Post } from './models'; // Import Post model

export const addBlog = async (req, res) => {
  try {
    const { title, content, categories, tags, image, published } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user._id, // Assuming user ID is attached to the request via authentication middleware
      categories,
      tags,
      image,
      published,
    });

    await newPost.save();
    return res.status(201).json({ success: true, message: 'Blog post created successfully', post: newPost });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
};


import { Post } from './models'; // Import Post model

export const editBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, categories, tags, image, published } = req.body;
    
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this post' });
    }

    // Update the post
    post.title = title || post.title;
    post.content = content || post.content;
    post.categories = categories || post.categories;
    post.tags = tags || post.tags;
    post.image = image || post.image;
    post.published = published !== undefined ? published : post.published;
    post.updatedAt = Date.now();

    await post.save();
    return res.status(200).json({ success: true, message: 'Blog post updated successfully', post });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
};


import { Post } from './models'; // Import Post model

export const deleteBlog = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this post' });
    }

    await post.remove();
    return res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
};


import { Post } from './models'; // Import Post model

export const getBlog = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID and populate author details
    const post = await Post.findById(postId).populate('author', 'username bio profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
};


import express from 'express';
import { addBlog, editBlog, deleteBlog, getBlog } from './controllers';

const router = express.Router();

// Add Blog Post
router.post('/add', addBlog);

// Edit Blog Post
router.put('/edit/:postId', editBlog);

// Delete Blog Post
router.delete('/delete/:postId', deleteBlog);

// Get Blog Post
router.get('/:postId', getBlog);

export default router;
