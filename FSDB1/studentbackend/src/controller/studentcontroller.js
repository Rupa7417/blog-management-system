import  User  from "../models/studentschema.js";  // Use named import


// Signup Function
export const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,  // Plain text password (not recommended for production)
      blogs: [],  // Initialize blogs array
    });

    await newUser.save();
    res.status(200).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add Blog Function
export const addBlog = async (req, res) => {
  try {
    const { email, title, content, status } = req.body;

    if (!email || !title || !content || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure the blogs array is initialized
    if (!user.blogs) {
      user.blogs = [];
    }

    const newBlog = {
      title,
      content,
      status,
      createdAt: new Date(),
    };

    user.blogs.push(newBlog);  // Add the new blog to the user's blogs array
    await user.save();

    res.status(200).json({ message: "Blog added successfully.", success: true, blogs: user.blogs });
  } catch (error) {
    console.error("Error adding blog:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Get Blogs Function
export const getBlogs = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      blogs: user.blogs,  // Return the list of blogs
    });
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit Blog Function
export const editBlog = async (req, res) => {
  try {
    const { email, blogId, newBlogData } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const blog = user.blogs.id(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Update only provided fields
    blog.title = newBlogData.title || blog.title;
    blog.content = newBlogData.content || blog.content;
    blog.status = newBlogData.status || blog.status;

    await user.save();
    res.status(200).json({ message: "Blog updated successfully.", success: true, blog });
  } catch (error) {
    console.error("Error editing blog:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Blog Function
export const deleteBlog = async (req, res) => {
  try {
    const { email, blogId } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const blogIndex = user.blogs.findIndex((blog) => blog._id.toString() === blogId);
    if (blogIndex === -1) {
      return res.status(404).json({ message: "Blog not found." });
    }

    user.blogs.splice(blogIndex, 1);  // Remove the blog from the array
    await user.save();

    res.status(200).json({ message: "Blog deleted successfully.", success: true, blogs: user.blogs });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials.", success: false });
    }

    res.status(200).json({
      message: "Login successful.",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        blogs: user.blogs,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
