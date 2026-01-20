import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserPost from "./UserPost";
import Loader from "../Loader";

import { API_URL } from "../utils";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const token = localStorage.getItem("token"); // Get fresh token

  // Fetch explore artworks
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await fetch(`${API_URL}/artworks/explore`, {
          headers: { Authorization: token }, // Standard Bearer format
        });
        const data = await res.json();
        // console.log(data);

        setArtworks(data || []);
      } catch (err) {
        console.error("Explore error:", err);
      }
    };

    fetchExplore();
  }, []);

  // Search profiles with Debounce & AbortController
  useEffect(() => {
    if (!query.trim()) {
      setProfiles([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchProfiles(controller.signal);
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort(); // Cancel the request if query changes or component unmounts
    };
  }, [query]);

  //search profile
  const searchProfiles = async (signal) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/profile/search?q=${query}`, {
        method: "GET",
        signal: signal, // Move signal inside this object
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setProfiles(data.users || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Search error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-violet-600">Search🔍</h1>
        <p className="text-gray-500 text-sm pt-1">
          Let's make a search for an artist rather than your soulmate👀
        </p>
      </div>
      <div className="max-w-full mx-auto p-4 bg-gray-100 h-full">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search artists here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-xl pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Results Dropdown/List */}
        {query && (
          <div className="bg-white w-xl border rounded-xl shadow-sm divide-y overflow-hidden">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Searching...</p>
            ) : profiles.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No users found</p>
            ) : (
              profiles.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    handleProfileClick(u._id);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  <img
                    src={
                      u.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${u.name}&background=random&color=fff`
                    }
                    alt={u.username[0].toUpperCase()}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-sm">@{u.username}</p>
                    <p className="text-xs text-gray-500">{u.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Explore Grid */}
        {!query && (
          <div className="mt-4 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {artworks.map((art) => (
              <div
                key={art._id}
                onClick={() => {
                  setSelectedPost(art);
                }}
                className="relative break-inside-avoid rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={art.imageUrl}
                  alt="Artwork"
                  className="w-full h-auto block object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />

                {/* Optional Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">View Artwork</p>
                </div>
              </div>
            ))}

            {selectedPost && (
              <UserPost
                postId={selectedPost._id}
                onClose={() => setSelectedPost(null)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
