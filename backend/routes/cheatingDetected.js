// const express = require("express");
// const router = express.Router();
// const User = require("../models/userModel"); // Adjust the path to your user model

// router.post("/cheatingDetected", async (req, res) => {
//   const { userId, email, comment, cheatImage } = req.body;

//   console.log("Request body:", req.body);

//   if (!email || !comment) {
//     return res.status(400).json({ message: "Email and comment are required." });
//   }

//   try {
//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Find the candidate by email in candidateData
//     const candidate = user.candidateData.find(
//       (candidate) => candidate.email === email
//     );

//     if (candidate) {
//       // Update the candidate's cheating details
//       candidate.cheatComment = comment;
//       candidate.cheatImage = cheatImage || candidate.cheatImage;
//     } else {
//       return res.status(404).json({ message: "Candidate data not found." });
//     }

//     // Save the updated user document
//     await user.save();

//     return res
//       .status(200)
//       .json({ message: "Cheating details updated successfully." });
//   } catch (error) {
//     console.error("Error updating cheating details:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error. Please try again later." });
//   }
// });

// module.exports = router;










const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjust the path to your user model
const mongoose = require("mongoose");

router.post("/cheatingDetected", async (req, res) => {
  let { userId, email, comment, cheatImage } = req.body;

  console.log("Received cheating report:", req.body);

  // Validate input
  if (!userId || !email || !comment) {
    return res.status(400).json({ message: "User ID, email, and comment are required." });
  }

  // Trim and validate userId
  userId = userId.trim();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the candidate by email in candidateData
    const candidate = user.candidateData.find(
      (candidate) => candidate.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate data not found." });
    }

    // Update the candidate's cheating details
    candidate.cheatComment = comment.trim();
    if (cheatImage) {
      candidate.cheatImage = cheatImage; // Update image only if provided
    }

    // Save the updated user document
    await user.save();

    console.log("Cheating details updated successfully for user:", userId);
    return res.status(200).json({ message: "Cheating details updated successfully." });
  } catch (error) {
    console.error("Error updating cheating details:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
