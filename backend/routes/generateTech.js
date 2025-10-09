const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const addOnPrompt = `
Generate a set of 4 technical interview questions on {{techType}} DSA problems. Each problem should include:
- A unique ID for the problem (not serializable).
- A title describing the problem.
- A detailed description of the problem, including:
  - Problem statement.
  - Input format.
  - Output format.
  - Example with input and output.
  - Constraints for the problem.
- Two test cases with:
  - A sample input for the problem.
  - The expected output for the provided input.

Format the description as a single string with line breaks and spaces for readability.
Return the set of problems as an array of objects in JSON format, where each object follows this structure:
{
  "id": "unique problem ID",
  "title": "Problem title",
  "desc": "Detailed problem description with proper formatting",
  "testCases": [
    {
      "input": "Sample input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Sample input",
      "expectedOutput": "Expected output"
    }
  ]
}`;

router.get("/generateTech", async (req, res) => {
  let techType = req.query.techType;
  if (!techType || techType.trim() === "") {
    techType = "common data structures and algorithms (DSA)";
  }

  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  // Helper: retry function with exponential backoff
  const retry = async (fn, retries = 3, delay = 2000) => {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0 && (err.status === 503 || err.statusText === "Service Unavailable")) {
        console.warn(`Model overloaded — retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retry(fn, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  try {
    const typeAddOnPrompt = addOnPrompt.replace("{{techType}}", techType);

    // Use latest stable model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Retry logic added for overloads
    const result = await retry(async () => await model.generateContent(typeAddOnPrompt));
    const rawResponse = result.response.text();
    console.log("Raw Response:", rawResponse);

    // Safe JSON parse (no brittle slicing)
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
    console.error("Error generating tech quiz:", error);

    // Fallback model if overloaded
    if (error.status === 503) {
      try {
        console.log("Falling back to gemini-1.5-pro-latest...");
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-1.5-pro-latest",
        });
        const fallbackPrompt = addOnPrompt.replace("{{techType}}", techType);
        const result = await fallbackModel.generateContent(fallbackPrompt);
        const rawResponse = result.response.text();
        const techProblems = JSON.parse(rawResponse);
        return res.status(200).json(techProblems);
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
      }
    }

    res.status(500).json({
      message: "Failed to generate technical questions",
      error: error.message,
    });
  }
});

module.exports = router;
