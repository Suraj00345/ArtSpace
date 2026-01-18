import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  UserPlus,
  CheckCheck,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:3000";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/notification/`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();

      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      await fetch(`${API_URL}/notification/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getIcon = (type) => {
    switch (type) {
      case "LIKE":
        return <Heart size={12} className="fill-red-500 text-red-500" />;
      case "COMMENT":
        return (
          <MessageSquare size={12} className="fill-blue-500 text-blue-500" />
        );
      case "FOLLOW":
        return <UserPlus size={12} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case "LIKE":
        return "liked your post.";
      case "COMMENT":
        return "commented on your post.";
      case "FOLLOW":
        return "started following you.";
      case "NEW_POST":
        return "shared a new post.";
      default:
        return "";
    }
  };

  return (
    <div className=" mx-auto min-h-screen bg-gray-100 md:border-x">
      {/* HEADER */}
      <div className="sticky top-0 bg-white z-10 px-6 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold">Notifications🔔</h2>
            <span className="text-gray-500 text-sm pt-1">
              Always receive notifications for updates, whether in real life or
              within ArtSpace 😉
            </span>
          </div>
          <CheckCheck size={20} className="text-gray-400" />
        </div>

        <div className="flex gap-4">
          {["all", "unread"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`pb-2 text-sm font-medium ${
                filter === t ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-20">{error}</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No notifications yet</p>
      ) : (
        filteredNotifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.isRead && markAsRead(n._id)}
            className={`bg-white p-6 rounded-xl shadow m-3 flex gap-4 px-6 py-4 cursor-pointer ${
              n.isRead ? "bg-white" : "bg-blue-50"
            }`}
          >
            <div className="relative">
              <img
                src={n.sender?.profilePhoto || "/avatar.png"}
                alt="user"
                className="w-12 h-12 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
                {getIcon(n.type)}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-bold">{n.sender?.name}</span>{" "}
                {getMessage(n)}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {!n.isRead && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
