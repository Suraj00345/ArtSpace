import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Loader from "../Loader";

const API_URL = "http://localhost:3000";

const UserPost = ({ postId, onClose }) => {
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("loggedInUser");

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  //  FETCH ARTWORK BY ID
  const fetchArtwork = async () => {
    try {
      const res = await fetch(`${API_URL}/artworks/get-artwork/${postId}`, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Failed to fetch artwork", err);
    }
  };

  //  FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/artworks/${postId}/comments`, {
        headers: { Authorization: token },
      });

      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  //  POST COMMENT
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/artworks/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const newComment = await res.json();

      // Optimistic UI update
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  //  INIT LOAD

  useEffect(() => {
    if (postId) {
      fetchArtwork();
      fetchComments();
    }
  }, [postId]);

  if (!post) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-md flex overflow-hidden">
        {/* IMAGE */}
        <div className="hidden md:flex w-2/3 bg-black items-center justify-center">
          <img
            src={post.imageUrl}
            className="max-h-full object-contain"
            alt=""
          />
        </div>

        {/* COMMENTS SIDE */}
        <div className="w-full md:w-1/3 flex flex-col bg-white">
          {/* HEADER */}
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src={
                  post.artist?.profilePhoto
                    ? post.artist.profilePhoto
                    : `https://ui-avatars.com/api/?name=${post.artist?.name}&background=random&color=fff`
                }
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div>
                <span className="font-bold text-base">{post.artist?.name}</span>
                <br />
                <span className="text-[12px] text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <X className="cursor-pointer" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="italic">{post.title}</p>
              <p className="text-gray-600 mt-1">{post.description}</p>
            </div>
            <hr />

            {comments.map((c) => (
              <div key={c._id} className="flex items-start gap-2">
                <img
                  className="h-5 w-5 rounded-full"
                  src={
                    c.user?.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${c.user?.name}`
                  }
                  alt=""
                />
                <p className="text-sm">
                  <span className="font-bold mr-1">
                    {c.user?.name || loggedInUser}
                  </span>
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm outline-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                onClick={handlePostComment}
                disabled={loading}
                className="text-violet-500 font-bold text-sm"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
