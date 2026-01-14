const jwt = require("jsonwebtoken");
const ensureAuthenticaticated = (req, res, next) => {
  const auth = req.headers["authorization"];
  // console.log("Auth ======>>>>>>>",auth.split(".")[1]);

  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized,JWT token is require" });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    // console.log(decoded);
    req.userId = decoded._id; // this is user id
    req.user = decoded; //this is the whole user
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized,JWT token wrong or expired" });
  }
};

module.exports = { ensureAuthenticaticated };
