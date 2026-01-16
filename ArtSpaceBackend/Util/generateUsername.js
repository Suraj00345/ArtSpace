const User = require("../Models/User");

const generateUsername = async (fullName) => {
  // 1. Replace all spaces with underscores and convert to lowercase
  // The / /g regex replaces ALL spaces, not just the first one
  const base = fullName.trim().replace(/\s+/g, "_").toLowerCase();

  // 2. Generate 3 random digits (between 100 and 999)
  const randomDigits = Math.floor(100 + Math.random() * 900);

  let username = `${base}${randomDigits}`;

  // 3. Collision Check: Ensure the generated name doesn't exist
  // We use a loop here just in case the random number is already taken
  let isTaken = await User.exists({ username });

  while (isTaken) {
    const newDigits = Math.floor(100 + Math.random() * 900);
    username = `${base}${newDigits}`;
    isTaken = await User.exists({ username });
  }

  return username;
};

module.exports = generateUsername;
