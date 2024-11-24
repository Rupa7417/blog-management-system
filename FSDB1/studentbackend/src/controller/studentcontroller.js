import User from "../models/studentschema.js";

// /import User from '../models/User';  // Adjust the path as needed to import the User model

// Signup Function
export const Signup = async (req, res) => {
  try {
    // Destructure the request body
    const { username, email, password } = req.body;

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
      student: [], // Initialize the student array (empty array)
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(200).json({ message: "User created successfully", success: true });
  } catch (error) {
    // Log and respond with error message in case of failure
    console.log("Error:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};


export const addBlog = async (req, res) => {
  try {
    const { email, title, content, status } = req.body;

    // Check if the email, title, content, and status are present
    if (!email || !title || !content || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add new blog
    const newBlog = { title, content, status };
    user.blogs.push(newBlog); // Add blog to the user's blogs array
    await user.save();

    res.status(200).json({
      message: "Blog added successfully.",
      success: true,
      blogs: user.blogs, // Return the updated list of blogs
    });
  } catch (error) {
    console.error("Error adding blog:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Get Blogs Function
export const getBlogs = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      blogs: user.blogs, // Return the list of blogs
    });
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editBlog = async (req, res) => {
  try {
    const { email, blogId, newBlogData } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the blog by blogId
    const blog = user.blogs.id(blogId); // Find the blog by _id
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Update blog details
    blog.title = newBlogData.title;
    blog.content = newBlogData.content;
    blog.status = newBlogData.status;

    await user.save();

    res.status(200).json({
      message: "Blog updated successfully.",
      success: true,
      blog: blog, // Return the updated blog data
    });
  } catch (error) {
    console.error("Error editing blog:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const { email, blogId } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the blog by blogId and remove it
    const blogIndex = user.blogs.findIndex((blog) => blog._id.toString() === blogId);
    if (blogIndex === -1) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Remove the blog from the array
    user.blogs.splice(blogIndex, 1);

    await user.save();

    res.status(200).json({
      message: "Blog deleted successfully.",
      success: true,
      blogs: user.blogs, // Return the updated blog list
    });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials.", success: false });
    }

    // Login successful
    res.status(200).json({
      message: "Login successful.",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        blogs: user.blogs, // Include the blogs associated with the user
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

