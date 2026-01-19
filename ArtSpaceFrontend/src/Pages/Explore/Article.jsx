import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserPost from "../UserPost";
import { usePostActions } from "./usePostActions";

const Article = ({ post: initialPost }) => {
  const navigate = useNavigate();
  const { post, comments, handleLike, handlePostComment } =
    usePostActions(initialPost);
  const [commentInput, setCommentInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loggedInUser = localStorage.getItem("loggedInUser");

  return (
    <article className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div
        className="flex items-center p-3 cursor-pointer"
        onClick={() => navigate(`/profile/${post.artist?._id}`)}
      >
        <img
          src={
            post.artist?.profilePhoto ||
            `https://ui-avatars.com/api/?name=${post.artist?.name}`
          }
          className="w-8 h-8 rounded-full mr-3"
          alt="avatar"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-tight">
            {post.artist?.name}
          </span>
          <span className="text-[10px] text-gray-500">
            {new Date(post.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>

      {/* IMAGE */}
      <img
        src={post.imageUrl}
        className="w-full aspect-square object-cover cursor-pointer"
        alt={post.title}
        onDoubleClick={handleLike}
      />

      {/* ACTIONS */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <Heart
            size={26}
            onClick={handleLike}
            className={`cursor-pointer transition-colors ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
          <MessageCircle
            size={26}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <Send size={26} className="cursor-pointer" />
          <Bookmark className="ml-auto cursor-pointer" />
        </div>

        <p className="font-semibold text-sm mb-1">{post.likesCount} likes</p>

        <div className="mb-2">
          <p className="text-sm font-bold italic">{post.title}</p>
          <p className="text-sm text-gray-700">{post.description}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-violet-500 font-light"
        >
          See comments...
        </button>

        {/* COMMENTS PREVIEW */}
        {comments.length > 0 && (
          <div className="mt-2 space-y-1">
            {comments.slice(-2).map((c, i) => (
              <p key={i} className="text-sm">
                <span className="font-semibold mr-2">{loggedInUser}</span>
                {c.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t p-3 flex gap-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 text-sm outline-none"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          onClick={() => {
            handlePostComment(commentInput);
            setCommentInput("");
          }}
          disabled={!commentInput.trim()}
          className="text-violet-500 font-semibold text-sm disabled:opacity-50"
        >
          Post
        </button>
      </div>

      {isModalOpen && (
        <UserPost postId={post._id} onClose={() => setIsModalOpen(false)} />
      )}
    </article>
  );
};

export default Article;
