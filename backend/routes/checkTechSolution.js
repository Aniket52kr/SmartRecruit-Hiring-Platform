const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// POST /checkTechSolution
router.post("/checkTechSolution", async (req, res) => {
  const { title, desc, code } = req.body;

  if (!title || !desc || !code) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  // Construct prompt
  const addOnPrompt = `
  Evaluate the following coding solution for correctness:
  -----------------------------------
  Problem Title: ${title}
  Problem Description:
  ${desc}

  User Code:
  ${code}
  -----------------------------------

  Analyze this code strictly against the problem requirements.
  Check with multiple edge and hidden test cases.

  Return JSON response (ONLY JSON, no markdown, no explanation), in this structure:
  {
    "success": true or false,
    "summary": "Brief 1-line summary of evaluation result — include pass/fail info."
  }

  Make sure:
  - Do not include code or solutions.
  - Keep response under 10 lines.
  - Be strict — small mistakes should mark failure.
  `;

  try {
    // Use the latest and stable Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let attempt = 0;
    const maxRetries = 3;
    let result, rawResponse;

    // Retry mechanism (handles 503 overload errors)
    while (attempt < maxRetries) {
      try {
        result = await model.generateContent(addOnPrompt);
        rawResponse = await result.response.text();
        break; // Exit loop if success
      } catch (err) {
        attempt++;
        console.warn(`Retrying Gemini API... Attempt ${attempt}`);
        if (attempt >= maxRetries) throw err;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }

    // Clean raw response (remove markdown fences if present)
    let cleanedResponse = rawResponse
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    // Try parsing JSON safely
    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw Response:", rawResponse);
      return res
        .status(500)
        .json({ success: false, error: "Invalid JSON from Gemini" });
    }

    // Send final parsed result
    res.status(200).json({
      success: true,
      evaluation: parsed,
    });
  } catch (error) {
    console.error("Error evaluating solution:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to evaluate the solution" });
  }
});

module.exports = router;
