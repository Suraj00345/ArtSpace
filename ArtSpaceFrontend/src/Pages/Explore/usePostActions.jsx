import { useState } from "react";
import { API_URL } from "../../utils";



export const usePostActions = (initialPost) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleLike = async () => {
    try {
      const res = await fetch(`${API_URL}/artworks/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const data = await res.json();
      setPost((prev) => ({ ...prev, isLiked: data.liked, likesCount: data.likesCount }));
    } catch (err) {
      console.error("Like failed:", err.message);
    }
  };

  const handlePostComment = async (text) => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/artworks/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ text }),
      });
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error("Comment failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { post, comments, loading, handleLike, handlePostComment };
};