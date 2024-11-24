import mongoose from 'mongoose';

// Define the Blog Sub-schema to store individual blog posts
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], required: true },  // Status could be 'draft' or 'published'
  createdAt: { type: Date, default: Date.now },  // Automatically set the creation date of the blog
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,  // Ensure that the username is unique
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,  // Ensure that the email is unique
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']  // Basic email validation
  },
  password: { 
    type: String, 
    required: true, 
  },
  bio: { 
    type: String, 
    default: ''  // Optional field for the user's bio, defaults to empty string
  },
  profilePicture: { 
    type: String, 
    default: ''  // Optional URL or path to the user's profile picture, defaults to empty string
  },
  createdAt: { 
    type: Date, 
    default: Date.now  // Automatically set the creation date of the user
  },
  blogs: [blogSchema],  // Array of blog posts, each blog follows the blogSchema
}, {
  timestamps: true,  // Automatically create `createdAt` and `updatedAt` fields
});

// Export the User model
const User = mongoose.model('User', userSchema);

export default User;
