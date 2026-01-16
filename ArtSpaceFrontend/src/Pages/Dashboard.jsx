import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const API_URL = "http://localhost:3000";

  // --- States ---
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [token, setToken] = useState(null);

  const fileInputRef = useRef(null);

  /* ARTWORK CREATE/EDIT STATE */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    description: "",
    image: null,
    preview: null,
  });

  /* 👤 PROFILE EDIT STATE */
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
    profilePhoto: null,
    preview: "",
  });

  /* 🔔 Notification Helper */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* 🔄 Fetch Profile Data (Stats + Artworks) */
  const fetchDashboardData = async (authToken) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(authToken);
      const userId = decoded._id || decoded.userId;

      const res = await fetch(`${API_URL}/profile/${userId}`, {
        headers: { Authorization: authToken },
      });
      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        setUser(data.user);
        setImages(data.artworks);
      } else {
        showNotification(data.message, "error");
      }
    } catch (err) {
      showNotification("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      fetchDashboardData(storedToken);
    }
  }, []);

  /* 👤 PROFILE UPDATE LOGIC */
  const handleEditProfile = () => {
    setProfileData({
      bio: user.bio || "",
      profilePhoto: null,
      preview: user.profilePhoto || "",
    });
    setIsProfileModalOpen(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("bio", profileData.bio);

      // Only append the photo if the user actually selected a new one
      if (profileData.profilePhoto) {
        data.append("profilePhoto", profileData.profilePhoto);
      }

      const res = await fetch(`${API_URL}/profile/updateProfile`, {
        method: "PUT",
        headers: {
          Authorization: token,
          // Note: Don't set 'Content-Type' header when sending FormData;
          // the browser sets it automatically with the boundary string.
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Update failed");

      // Update the main user state with the returned updated user data
      setUser(result.user);
      setIsProfileModalOpen(false);
      showNotification("Profile updated successfully!");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /*ARTWORK LOGIC (Upload, Delete, Update) */
  const handleUpload = async () => {
    if (!formData.title || !formData.image)
      return showNotification("Title & image required", "error");
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("image", formData.image);
      const res = await fetch(`${API_URL}/artworks/upload`, {
        method: "POST",
        headers: { Authorization: token },
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setImages((prev) => [result.artwork || result, ...prev]);
      setFormData({ title: "", description: "", image: null });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showNotification("Artwork uploaded");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete artwork?")) return;
    try {
      setDeleteLoading(id);
      const res = await fetch(`${API_URL}/artworks/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        setImages(images.filter((img) => img._id !== id));
        showNotification("Deleted");
      }
    } catch {
      showNotification("Delete failed", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (artwork) => {
    setEditData({
      _id: artwork._id,
      title: artwork.title,
      description: artwork.description,
      image: null,
      preview: artwork.imageUrl,
    });
    setIsEditOpen(true);
  };

  const handleUpdateArtwork = async () => {
    try {
      const data = new FormData();
      data.append("title", editData.title);
      data.append("description", editData.description);

      if (editData.image) data.append("image", editData.image);

      const res = await fetch(`${API_URL}/artworks/edit/${editData._id}`, {
        method: "PUT",
        headers: { Authorization: token },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setImages((prev) =>
        prev.map((img) => (img._id === editData._id ? result : img))
      );
      setIsEditOpen(false);
      showNotification("Artwork Updated");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* 👤 Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 text-center relative">
        <button
          onClick={handleEditProfile}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>

        <div className="w-40 h-40 mx-auto rounded-full bg-purple-500 text-white text-6xl flex items-center justify-center overflow-hidden">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : user.username ? (
            user.username[0].toUpperCase()
          ) : (
            "U"
          )}
        </div>
        <h2 className="mt-3 font-semibold text-2xl">{user.name}</h2>
        <h2 className="mt-1 text-gray-600 font-semibold">@{user.username}</h2>
        <p className="text-gray-500 mt-1">{user.bio || "No bio yet"}</p>

        <div className="flex justify-center gap-10 mt-4">
          <div>
            <p className="font-semibold">{images.length}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold">{user.followersCount || 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{user.followingCount || 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {/* ➕ Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="font-semibold mb-3">Upload Artwork</h3>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-3 rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-3 rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-3 rounded"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files[0]) {
              setFormData({ ...formData, image: e.target.files[0] });
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {imagePreview && (
          <img src={imagePreview} className="h-40 mt-3 rounded" />
        )}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </div>

      {/* 🖼 Artwork Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white rounded shadow overflow-hidden"
          >
            <img src={img.imageUrl} className="h-48 w-full object-cover" />
            <div className="p-3">
              <h4 className="font-semibold">{img.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">
                {img.description}
              </p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEdit(img)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-500"
                >
                  {deleteLoading === img._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✏️ Artwork Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-semibold mb-3">Edit Artwork</h3>
            {editData.preview && (
              <img
                src={editData.preview}
                className="h-40 w-full object-cover rounded mb-3"
              />
            )}
            <input
              type="file"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  image: e.target.files[0],
                  preview: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
            <input
              className="border p-2 w-full mt-3 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <textarea
              className="border p-2 w-full mt-3 rounded"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button
                onClick={handleUpdateArtwork}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👤 Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-3 border-2 border-purple-500">
                {profileData.preview ? (
                  <img
                    src={profileData.preview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-purple-100 transition">
                Change Photo{" "}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setProfileData({
                        ...profileData,
                        profilePhoto: e.target.files[0],
                        preview: URL.createObjectURL(e.target.files[0]),
                      });
                    }
                  }}
                />
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Username (Disabled)
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
