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

  // Fetch blogs when component mounts
  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setUserName(username);

    if (email) {
      fetchBlogs(email);
    }
  }, []);

  // Fetch blogs from backend
  const fetchBlogs = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/admin/:postId", { email });
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

  // Handle blog creation (add)
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
      const response = await axios.post("http://localhost:3000/api/admin/add", data);

      if (response.data.success) {
        alert("Blog added successfully!");
        setTitle("");
        setContent("");
        setStatus("draft");

        // Re-fetch blogs to update the list
        fetchBlogs(email);
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

  // Handle blog deletion
  const deleteBlog = async (id) => {
    const email = localStorage.getItem("email");

    try {
      const response = await axios.post("http://localhost:3000/api/admin/delete/:postId", { email, blogId: id });
      alert("Blog successfully deleted!");

      // Re-fetch blogs to update the list
      fetchBlogs(email);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog.");
    }
  };

  // Handle blog update
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
      newBlogData: { title, content, status },
    };

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/admin/editBlog", data);

      if (response.data.success) {
        alert("Blog updated successfully!");
        setTitle("");
        setContent("");
        setStatus("draft");
        setEditingBlog(null);
        fetchBlogs(email); // Refresh blogs
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

  // Function to populate form fields for editing
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
