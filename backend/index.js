const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Setup CORS options
const corsOptions = {
  origin: [
    "https://smart-recruit-hiring-platform.vercel.app",
    process.env.FRONTEND_URL,
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));



// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed:", err)
);



// Import Mongoose models
const User = require("./models/userModel");


// Import all routes
const signup = require("./routes/signup");
const login = require("./routes/login");
const addQuiz = require("./routes/addQuiz");
const getQuiz = require("./routes/getQuiz");
const generateQuiz = require("./routes/generateQuiz");
const updateUser = require("./routes/updateUser");
const generateTech = require("./routes/generateTech");
const addTech = require("./routes/addTech");
const getTech = require("./routes/getTech");
const getUserInfo = require("./routes/getUserInfo");
const checkTechSolution = require("./routes/checkTechSolution");
const cheatingDetected = require("./routes/cheatingDetected");



// Use all routes
app.use("/api", signup);
app.use("/api", login);
app.use("/api", addQuiz);
app.use("/api", getQuiz);
app.use("/api", generateQuiz);
app.use("/api", updateUser);
app.use("/api", generateTech);
app.use("/api", addTech);
app.use("/api", getTech);
app.use("/api", getUserInfo);
app.use("/api", checkTechSolution);
app.use("/api", cheatingDetected);



// Real-time text update routes
let currentText = "";


app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);

  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);
  }, 1000);

  req.on("close", () => clearInterval(intervalId));
});


app.post("/api/update", (req, res) => {
  currentText = req.body.text;
  res.status(200).send("Text updated successfully");
});



// Test route to verify server is working
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


























// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");

// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL,
//     "http://localhost:5173",
//     "https://smart-recruit-hiring-platform.vercel.app",
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
// };
// app.use(cors(corsOptions));

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Database Connected ");
//   })
//   .catch((err) => console.error("Database Connection Failed: ", err));

// const User = require("./models/userModel");

// // Real-time text update logic
// let currentText = "";

// app.get("/api/events", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   // Send initial data
//   res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);

//   const intervalId = setInterval(() => {
//     res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);
//   }, 1000);

//   req.on("close", () => {
//     clearInterval(intervalId);
//   });
// });

// app.post("/api/update", (req, res) => {
//   currentText = req.body.text;
//   res.status(200).send("Text updated successfully");
// });

// // Other route imports
// const signup = require("./routes/signup");
// const login = require("./routes/login");
// const addQuiz = require("./routes/addQuiz");
// const getQuiz = require("./routes/getQuiz");
// const generateQuiz = require("./routes/generateQuiz");
// const updateUser = require("./routes/updateUser");
// const generateTech = require("./routes/generateTech");
// const addTech = require("./routes/addTech");
// const getTech = require("./routes/getTech");
// const getUserInfo = require("./routes/getUserInfo");
// const checkTechSolution = require("./routes/checkTechSolution");
// const cheatingDetected = require("./routes/cheatingDetected");

// // Use routes
// app.use(signup);
// app.use(login);
// app.use(addQuiz);
// app.use(getQuiz);
// app.use(generateQuiz);
// app.use(updateUser);
// app.use(generateTech);
// app.use(addTech);
// app.use(getTech);
// app.use(getUserInfo);
// app.use(checkTechSolution);
// app.use(cheatingDetected);

// // Test route for users
// app.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.send("Error, check console");
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Server setup
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;
