import React, { useState, useEffect } from "react";
import axios from "axios";

const Blog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setUserName(username);

    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const response = await axios.post("http://localhost:3000/api/blogs/get", { email });
        const formattedBlogs = response.data.blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }));
        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("An error occurred while fetching the blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      alert("No email found in localStorage.");
      return;
    }

    const data = {
      email,
      title,
      content,
      status,
    };

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/blogs/add", data);

      if (response.data.success) {
        alert("Blog added successfully!");
        setTitle("");
        setContent("");
        setStatus("draft");

        const formattedBlogs = response.data.blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }));
        setBlogs(formattedBlogs);
      } else {
        setMessage(response.data.message || "Failed to add blog.");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      setMessage("An error occurred while adding the blog.");
    } finally {
      setLoading(false);
    }
  };


// const addBlog = async (req, res) => {
//     try {
//       const { email, title, content, status } = req.body;
  
//       // Check if the email, title, content, and status are present
//       if (!email || !title || !content || !status) {
//         return res.status(400).json({ message: "All fields are required." });
//       }
  
//       // Find the user by email
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(404).json({ message: "User not found." });
//       }
  
//       // Add new blog
//       const newBlog = { title, content, status };
//       user.blogs.push(newBlog); // Add blog to the user's blogs array
//       await user.save();
  
//       res.status(200).json({
//         message: "Blog added successfully.",
//         success: true,
//         blogs: user.blogs, // Return the updated list of blogs
//       });
//     } catch (error) {
//       console.error("Error adding blog:", error.message);
//       res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
//   };


  
  const addBlog = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    const email = localStorage.getItem("email"); // Get the email from localStorage
  
    if (!email) {
      alert("No email found. Please log in first.");
      return;
    }
  
    const data = {
      email, // User's email
      title, // Blog title
      content, // Blog content
      status, // Blog status (draft or published)
    };
  
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3000/api/blogs/add", data);
  
      if (response.data.success) {
        alert("Blog added successfully!");
  
        // Reset form fields after successful addition
        setTitle("");
        setContent("");
        setStatus("draft");
  
        // Update blogs list in state
        const formattedBlogs = response.data.blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }));
        setBlogs(formattedBlogs);
      } else {
        setMessage(response.data.message || "Failed to add blog.");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      setMessage("An error occurred while adding the blog.");
    } finally {
      setLoading(false);
    }
  };
  

  const deleteBlog = async (id) => {
    const email = localStorage.getItem("email");

    try {
      const response = await axios.post("http://localhost:3000/api/blogs/delete", { email, blogId: id });
      alert("Blog successfully deleted!");
      const formattedBlogs = response.data.blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        content: blog.content,
        status: blog.status,
      }));
      setBlogs(formattedBlogs);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email || !editingBlog) {
      alert("No email or blog found.");
      return;
    }

    const data = {
      email,
      blogId: editingBlog.id,
      newBlogData: {
        title,
        content,
        status,
      },
    };

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/blogs/edit", data);

      if (response.data.success) {
        alert("Blog updated successfully!");
        setTitle("");
        setContent("");
        setStatus("draft");
        setEditingBlog(null);

        const formattedBlogs = response.data.blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          status: blog.status,
        }));
        setBlogs(formattedBlogs);
      } else {
        setMessage(response.data.message || "Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage("An error occurred while updating the blog.");
    } finally {
      setLoading(false);
    }
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setStatus(blog.status);
  };

  return (
    <div className="blog-container">
      <h2>{editingBlog ? "Edit Blog" : "Add Blog"}</h2>

      {message && <p>{message}</p>}

      <form onSubmit={editingBlog ? handleUpdate : handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingBlog ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      <h3>Blog List</h3>
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <strong>{blog.title}</strong> - {blog.status}
              <button onClick={() => editBlog(blog)} style={{ marginLeft: "10px" }}>
                Edit
              </button>
              <button onClick={() => addBlog(blog.id)} style={{ marginLeft: "10px" }}>
                add
              </button>
              <button onClick={() => deleteBlog(blog.id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
