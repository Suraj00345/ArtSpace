import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import {socket} from "../socket";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal & Menu States
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (artistId) => {
    const id = typeof artistId === "object" ? artistId._id : artistId;
    if (!id) {
      console.error("No ID found for artist:", artistId);
      return;
    }
    // console.log("Navigating to profile with ID:", id);
    navigate(`/profile/${id}`);
  };

  const API_URL = "http://localhost:3000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    //here we fetch all the posts
    const fetchExplorePosts = async () => {
      try {
        const res = await fetch(`${API_URL}/artworks/explore`, {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        //console your data here
        // console.log(data);
        setPosts(data.map((post) => ({ ...post, isLiked: post.liked })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExplorePosts();
  }, []);

  //fetch all the comments
  const fetchComments = async (artworkId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/artworks/${artworkId}/comments`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      console.log(data);

      setComments((prev) => ({ ...prev, [artworkId]: data }));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  //handleLike function
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/artworks/${postId}/like`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, isLiked: data.liked, likesCount: data.likesCount }
            : p
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  //handlePostComment function ==> where we add comments to a post
  const handlePostComment = async (artworkId) => {
    const text = commentText[artworkId];
    if (!text?.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/artworks/${artworkId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ text }),
      });
      const newComment = await res.json();
      setComments((prev) => ({
        ...prev,
        [artworkId]: [...(prev[artworkId] || []), newComment],
      }));
      setCommentText((prev) => ({ ...prev, [artworkId]: "" }));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="w-full px-4 py-7 ">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-gray-500 text-sm">
          Everyone is an artist these days, so discover artwork from artists
          around the world 🐻
        </p>
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-10 pt-3">
        {loading && <div className="py-12">Loading feed...</div>}

        {/* FEED */}
        <div className="flex flex-col gap-6 w-full max-w-[470px]">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white border border-gray-300 rounded-xl"
            >
              <div className="flex items-center justify-between p-3">
                <div
                  className="flex items-center gap-3"
                  onClick={() => {
                    handleProfileClick(post.artist._id);
                  }}
                >
                  <img
                    src={
                      post.artist?.profilePhoto
                        ? post.artist.profilePhoto
                        : `https://ui-avatars.com/api/?name=${post.artist?.name}&background=random&color=fff`
                    }
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col">
                    {/* Added a wrapper to stack name and time */}
                    <span className="font-semibold text-sm leading-tight">
                      {post.artist?.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {post.createdAt &&
                        new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                </div>
                <MoreHorizontal
                  size={20}
                  className="text-gray-600 cursor-pointer"
                />
              </div>

              <img
                src={post.imageUrl}
                className="w-full aspect-square object-cover"
                alt=""
                onDoubleClick={() => handleLike(post._id)}
              />

              <div className="p-3">
                <div className="flex items-center gap-4 mb-2">
                  <Heart
                    size={26}
                    onClick={() => handleLike(post._id)}
                    className={`cursor-pointer ${
                      post.isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <MessageCircle
                    size={26}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      fetchComments(post._id);
                    }}
                  />
                  <Send size={26} />
                  <Bookmark className="ml-auto" />
                </div>

                <p className="font-semibold text-sm mb-1">
                  {post.likesCount} likes
                </p>

                {/* Title and Description */}
                <div className="mb-2">
                  <p className="text-sm font-bold italic">{post.title}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {post.description}
                  </p>
                </div>

                {/* SEE COMMENTS BUTTON */}
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    fetchComments(post._id);
                  }}
                  className="text-blue-500 text-sm mb-2 hover:underline"
                >
                  See comments...
                </button>

                {/* FEED COMMENTS (Preview) */}
                <div className="space-y-1">
                  {comments[post._id]?.slice(0, 2).map((c) => (
                    <p key={c._id} className="text-sm">
                      <span className="font-semibold text-gray-600 mr-2">
                        {c.user?.name || "user"}
                      </span>
                      {c.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* FEED COMMENT INPUT */}
              <div className="border-t p-3 flex gap-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 text-sm outline-none"
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post._id]: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() => handlePostComment(post._id)}
                  disabled={!commentText[post._id]}
                  className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* --- POPUP / MODAL --- */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl h-[80vh] rounded-md flex overflow-hidden">
              {/* Modal Image */}
              <div className="hidden md:flex w-2/3 bg-black items-center justify-center">
                <img
                  src={selectedPost.imageUrl}
                  className="max-h-full object-contain"
                  alt=""
                />
              </div>

              {/* Modal Comments Side */}
              <div className="w-full md:w-1/3 flex flex-col bg-white">
                <div className="p-3 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        selectedPost.artist?.profilePhoto
                          ? selectedPost.artist.profilePhoto
                          : `https://ui-avatars.com/api/?name=${selectedPost.artist?.name}&background=random&color=fff`
                      }
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div>
                      <span className="font-bold text-base">
                        {selectedPost.artist?.name}
                      </span>
                      <br />
                      <span className="text-[10px] text-gray-500">
                        {selectedPost.createdAt &&
                          new Date(selectedPost.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                      </span>
                    </div>
                  </div>
                  <X
                    className="cursor-pointer"
                    onClick={() => setSelectedPost(null)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-md">
                    <p className="italic">{selectedPost.title}</p>
                    <p className="text-gray-600 mt-1">
                      {selectedPost.description}
                    </p>
                  </div>
                  <hr />
                  {comments[selectedPost._id]?.map((c) => (
                    <div
                      key={c._id}
                      className="flex justify-between items-start group"
                    >
                      <p className="text-sm flex justify-items-center gap-1">
                        <img
                          className="h-5 w-5 rounded-xl"
                          src={c.user?.profilePhoto}
                          alt=""
                        />
                        <span className="font-bold mr-1">
                          {c.user?.name || "user"}
                        </span>
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm outline-none"
                      value={commentText[selectedPost._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [selectedPost._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handlePostComment(selectedPost._id)}
                      disabled={loading}
                      className="text-blue-500 font-bold text-sm"
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
