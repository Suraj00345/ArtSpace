import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { artistId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/profile/${artistId}`, {
          headers: { Authorization: token },
        });
        const result = await res.json();

        if (res.ok) {
          setData(result);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistProfile();
    }
  }, [artistId]);

  // --- NEW FOLLOW/UNFOLLOW LOGIC ---
  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const isFollowing = data.user.isFollowing;

      // Determine endpoint based on current state
      const endpoint = isFollowing ? "unfollow" : "follow";

      const res = await fetch(`${API_URL}/${endpoint}/${artistId}`, {
        method: "POST", // Usually POST for actions that modify data
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Update local state to show change immediately
        setData((prevData) => ({
          ...prevData,
          user: {
            ...prevData.user,
            isFollowing: !isFollowing,
            // Update follower count locally
            followersCount: isFollowing
              ? prevData.user.followersCount - 1
              : prevData.user.followersCount + 1,
          },
        }));
      } else {
        const errorData = await res.json();
        console.error(`Failed to ${endpoint}:`, errorData.message);
      }
    } catch (error) {
      console.error("Network error during follow toggle:", error);
    }
  };
  // ---------------------------------

  if (loading)
    return <div className="text-center py-20">Loading Profile...</div>;
  if (!data || !data.user)
    return <div className="text-center py-20">User not found.</div>;

  const { user, artworks } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={user.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>

              {!user.isMe && (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-1.5 rounded-full font-medium transition-all duration-200 text-sm shadow-sm border ${
                    user.isFollowing
                      ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            <p className="text-gray-500 mt-1">
              {user.bio || "No bio available"}
            </p>

            <div className="flex justify-center md:justify-start gap-6 mt-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {artworks.length}
                </p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {user.followersCount || 0}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {user.followingCount || 0}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Latest Artworks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artworks.map((art) => (
              <div
                key={art._id}
                className="group relative overflow-hidden rounded-lg shadow-sm aspect-square bg-gray-200"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <p className="text-white font-medium text-sm px-2 text-center">
                    {art.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {artworks.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              No artworks uploaded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
