const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const addOnPrompt = `
Generate an aptitude quiz with 10 questions. Each question should have:
- A question text.
- 4 options labeled A, B, C, and D.
- The correct answer.
- Questions on {{quizType}}
Return the quiz as an array of objects in JSON format, where each object contains:
{
  "id": "a very unique id (not serializable)",
  "que": "Question text",
  "a": "option A",
  "b": "option B",
  "c": "option C",
  "d": "option D",
  "ans": "correct answer option (like a,b,c,d)"
}
`;

router.get("/generateQuiz", async (req, res) => {
  let quizType = req.query.quizType;
  if (!quizType || quizType.trim() === "") {
    quizType =
      "aptitude including logical reasoning, problem solving, and critical thinking.";
  }

  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  // Helper: retry function
  const retry = async (fn, retries = 3, delay = 2000) => {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0 && (err.status === 503 || err.statusText === "Service Unavailable")) {
        console.warn(`Model overloaded — retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retry(fn, retries - 1, delay * 2); // exponential backoff
      }
      throw err;
    }
  };

  try {
    const typeAddOnPrompt = addOnPrompt.replace("{{quizType}}", quizType);

    // Try with gemini-2.5-flash first
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await retry(async () => await model.generateContent(typeAddOnPrompt));
    const rawResponse = result.response.text();
    console.log("Raw Response:", rawResponse);

    // Parse Gemini's output safely
    let responseText;
    try {
      responseText = JSON.parse(rawResponse);
    } catch (err) {
      const start = rawResponse.indexOf("[");
      const end = rawResponse.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        const jsonSubstring = rawResponse.slice(start, end + 1);
        responseText = JSON.parse(jsonSubstring);
      } else {
        throw err;
      }
    }

    res.status(200).json(responseText);
  } catch (error) {
    console.error("Error generating quiz:", error);

    // Try fallback model if flash is down
    if (error.status === 503) {
      try {
        console.log("Falling back to gemini-1.5-pro-latest...");
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-1.5-pro-latest",
        });
        const fallbackPrompt = addOnPrompt.replace("{{quizType}}", quizType);
        const result = await fallbackModel.generateContent(fallbackPrompt);
        const rawResponse = result.response.text();
        const quiz = JSON.parse(rawResponse);
        return res.status(200).json(quiz);
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
      }
    }

    res.status(500).json({
      message: "Failed to generate quiz",
      error: error.message,
    });
  }
});

module.exports = router;
