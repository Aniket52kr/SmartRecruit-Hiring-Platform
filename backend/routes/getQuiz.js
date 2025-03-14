// const express = require("express");
// const router = express.Router();
// const Quiz = require("../models/quizModel");
// const User = require("../models/userModel");

// router.get("/getQuiz", async (req, res) => {
//   const { userId } = req.query;

//   try {
//     let quizzes;

//     if (userId) {
//       // If userId is provided, get the user's allAptitudes
//       const user = await User.findById(userId); // Correct method to fetch a single document
//       if (!user) {
//         return res.status(404).send("User not found");
//       }
//       quizzes = user.allAptitudes; // Access the user's allAptitudes array
//     } else {
//       // If userId is not provided,
//       quizzes = await Quiz.find();
//     }

//     // Map through quizzes if they exist
//     const modifiedQuizzes = quizzes?.map((quiz) => {
//       quiz.id = quiz._id;

//       return quiz;
//     });

//     res.status(200).json(modifiedQuizzes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Something went wrong from backend");
//   }
// });

// module.exports = router;















const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

router.get("/getQuiz", async (req, res) => {
  let { userId } = req.query;

  try {
    let quizzes = [];

    if (userId) {
      userId = userId.trim();

      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      // Fetch the user and their allAptitudes
      const user = await User.findById(userId).lean(); // Use `.lean()` to return plain JS objects
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      quizzes = user.allAptitudes || []; // Ensure it's always an array
    } else {
      quizzes = await Quiz.find().lean(); // Use `.lean()` to return plain JS objects
    }

    // Ensure quizzes is an array of objects
    const modifiedQuizzes = quizzes.map((quiz) => ({
      id: quiz._id?.toString(), // Convert ObjectId to string
      ...quiz, // Spread quiz object
    }));

    res.status(200).json(modifiedQuizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
