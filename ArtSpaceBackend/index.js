const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { init } = require("./Util/socket.js");
const cors = require("cors");
require("dotenv").config();
const app = express();

//create Http server
const httpServer = createServer(app);

//start socket.io server
init(httpServer);

// bodyParser.json() middleware is used in Node.js/Express.js
// applications to parse incoming HTTP request bodies that are in JSON format,
app.use(bodyParser.json());
app.use(cors());

// DB connection
require("./Models/db");

//PORT
const PORT = process.env.PORT || 3001;

// Routes
const AuthRouter = require("./Routes/AuthRouter.js");
const ArtworkRouter = require("./Routes/ArtworkRouter.js");
const commentRouter = require("./Routes/CommentRouter.js");
const ProfileRouter = require("./Routes/ProfileRouter.js");
const FollowRouter = require("./Routes/FollowRouter.js");
const NotificationRouter = require("./Routes/NotificationRouter.js");
const SettingsRouter = require("./Routes/SettingsRouter.js");

//Auth router
app.use("/auth", AuthRouter);
//Artwork router
app.use("/artworks", ArtworkRouter);
//Comment router
app.use("/", commentRouter);
//Profile router
app.use("/profile", ProfileRouter);
//Follow router
app.use("/", FollowRouter);
//Notification router
app.use("/notification", NotificationRouter);
//Settings router
app.use("/settings", SettingsRouter);

// Health check
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
