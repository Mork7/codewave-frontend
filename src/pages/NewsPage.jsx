import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useProfile } from "../hooks";
import { useApiHost } from "../hooks";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Ensure Quill's CSS is loaded
import DOMPurify from "dompurify";

function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [image, setImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [editingPostImage, setEditingPostImage] = useState(null); // Track the image of the post being edited
  const imageInputRef = useRef(null);
  const { role } = useProfile();
  const { API_HOST } = useApiHost();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_HOST}/news/posts`, {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [API_HOST]);

  const handlePostSubmit = async () => {
    if (!newPostText.trim()) return;

    let imageUrl = editingPostImage || null;
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const response = await axios.post(`${API_HOST}/news/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        imageUrl = response.data.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    try {
      if (editingPostId) {
        // Update existing post
        const response = await axios.put(
          `${API_HOST}/news/posts/${editingPostId}`,
          {
            text: newPostText,
            image: imageUrl,
          },
          { withCredentials: true }
        );

        // Debugging: Log the response from the server
        console.log("Update Response:", response.data);

        // Update the posts state
        setPosts(
          posts.map((post) =>
            post.id === editingPostId
              ? { ...post, text: newPostText, image: imageUrl }
              : post
          )
        );
      } else {
        // Create new post
        const response = await axios.post(
          `${API_HOST}/news/posts`,
          {
            text: newPostText,
            image: imageUrl,
          },
          { withCredentials: true }
        );

        const newPost = {
          id: response.data.postId,
          text: newPostText,
          image: imageUrl,
        };

        setPosts([newPost, ...posts]);
      }

      // Reset form
      setNewPostText("");
      setImage(null);
      setEditingPostId(null);
      setEditingPostImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving post:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Status Code:", error.response.status);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_HOST}/news/posts/${postId}`, {
        withCredentials: true,
      });

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit) {
      setEditingPostId(postId);
      setNewPostText(postToEdit.text);
      setEditingPostImage(postToEdit.image);
    }
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Text formatting options
      [{ size: ["small", false, "large", "huge"] }], // Font size options
      [{ align: [] }], // Text alignment options
      ["clean"], // Remove formatting
    ],
  };

  const formats = ["bold", "italic", "underline", "strike", "size", "align"];

  return (
    <div className="px-6 flex flex-col">
      {role === "admin" && (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-[5%]">
          <ReactQuill
            theme="snow"
            value={newPostText}
            onChange={setNewPostText}
            modules={modules}
            formats={formats}
            placeholder="Write a new post..."
          />
          <div className="flex justify-between items-center mt-4 w-full">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageInputRef}
                className="border p-2 rounded"
              />
              {editingPostImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img
                    src={`${API_HOST}${editingPostImage}`}
                    alt="Current"
                    className="mt-1 max-w-full h-24"
                  />
                </div>
              )}
            </div>
            <button
              className="button-base bg-pink-500 text-white p-2 rounded"
              onClick={handlePostSubmit}
            >
              {editingPostId ? "Edit" : "Post"}
            </button>
          </div>
        </div>
      )}
      <h2 className="mt-24 text-4xl self-center font-semibold text-gray-800">
        Recent News
      </h2>

      <div className="grid grid-cols-4 gap-4 items-center mt-6">
        {posts.length === 0 ? (
          <p className="col-span-4 text-center text-gray-500">No Posts Yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="relative mb-4 p-4 bg-white shadow rounded"
            >
              {role === "admin" && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    className="text-gray-500 hover-pink"
                    onClick={() => handleEditPost(post.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-gray-500 hover-pink"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.text),
                }}
              />
              {post.image && (
                <div className="mt-2 h-96 w-full overflow-hidden rounded">
                  <img
                    src={`${API_HOST}${post.image}`}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsPage;
