import { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    username: "surajkumar",
    email: "suraj@gmail.com",
    bio: "Digital artist | UI lover",
    avatar: "https://i.pravatar.cc/150?img=12",
    emailVerified: false,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setProfile({ ...profile, avatar: preview });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile updated (dummy)");
  };

  const handleVerifyEmail = () => {
    alert("Verification email sent (dummy)");
    setProfile({ ...profile, emailVerified: true });
  };

  const handleLogout = () => {
    alert("Logged out");
    // localStorage.clear();
    // window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className=" mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={profile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />

          <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex justify-between">
              Email
              {profile.emailVerified ? (
                <span className="text-green-600 text-xs">Verified</span>
              ) : (
                <span className="text-red-500 text-xs">Not verified</span>
              )}
            </label>

            <div className="flex gap-3 mt-1">
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="flex-1 border rounded-lg p-2"
              />

              {!profile.emailVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
                >
                  Verify
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={profile.bio}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
