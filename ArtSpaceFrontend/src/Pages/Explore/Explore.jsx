import { useEffect, useState } from "react";
import Loader from "../../Loader";
import Article from "./Article";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    //here we fetch all the posts
    const fetchExplorePosts = async () => {
      try {
        setLoading(true);
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

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="w-full px-4 py-6 ">
        <h1 className="text-3xl font-bold">Explore💥</h1>
        <p className="text-gray-500 text-sm pt-1">
          Everyone is an artist these days, so discover artworks from artists
          around the world 🐻
        </p>
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-10 pt-3">
        {loading && <div className="py-12">Loading feed...</div>}

        {/* FEED */}
        <div className="flex flex-col gap-6 w-full max-w-117.5">
          {posts.map((post) => (
            <Article key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
