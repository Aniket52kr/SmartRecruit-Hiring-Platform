import { useState, useEffect, useRef } from "react";
import {
  Play,
  AlertCircle,
  Sun,
  Clock,
  Moon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import sendHREmail from "../components/HRemail";

// Constants
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0",
  go: "1.16.2",
  ruby: "3.0.1",
  rust: "1.68.2",
  php: "8.2.3",
};

let currentlyScored = 0;
let isPasteAllowed = true;

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language,
    version: LANGUAGE_VERSIONS[language],
    files: [{ content: sourceCode }],
  });
  return response.data;
};

const TechRound = () => {
  // Auth/Login states
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [candidatesEmails, setCandidatesEmails] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(true);

  // Tech round states
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [codeStore, setCodeStore] = useState({});
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitRunning, setSubmitIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [showCheatingModal, setShowCheatingModal] = useState(false);

  const codeEditorRef = useRef(null);

  // ========== AUTH & INIT ==========

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      alert("User ID is required.");
      return;
    }
    if (!name.trim()) {
      setLoginError("Name is required");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setLoginError("Please enter a valid email");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
      const emails = response.data.candidateData?.map((c) => c.email) || [];
      if (!emails.some((e) => e === email)) {
        alert("Email does not exist. Please enter a valid email.");
        return;
      }

      localStorage.setItem("userName", name);
      localStorage.setItem("technicalUserId", userId);
      localStorage.setItem("technicalUserEmail", email);

      isPasteAllowed = false;

      const techTime = response.data.techTime || 0;
      setRemainingTime(techTime * 60);
      setIsTimerRunning(true);
      setJobRole(response.data.jobRole);
      setCompanyName(response.data.companyName);
      setPassingMarks(response.data.technicalPassingMarks);

      setShowLoginForm(false);
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to fetch user info. Please try again.");
    }
  };

  // ========== EFFECTS ==========

  useEffect(() => {
    const handlePaste = (e) => {
      if (!isPasteAllowed) {
        e.preventDefault();
        alert("Pasting is disabled during the technical round.");
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isPasteAllowed) {
        setShowCheatingModal(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (showLoginForm) return;

    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getTech`, {
          params: { userId: localStorage.getItem("technicalUserId") },
        });
        const validProblems = response.data.techEntries.filter(
          (p) => p && typeof p === "object" && p.title
        );
        setProblems(validProblems);

        const initialCodeStore = {};
        validProblems.forEach((_, i) => {
          initialCodeStore[i] = "";
        });
        setCodeStore(initialCodeStore);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problems:", err);
        setLoading(false);
      }
    };

    fetchProblems();
  }, [showLoginForm]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, remainingTime]);

  // ========== HANDLERS ==========

  const handleEndSession = async () => {
    if (!window.confirm("Do you really want to end this session? All your problems will be sent for checking.")) {
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/updateUser`, {
        userId: localStorage.getItem("technicalUserId"),
        userEmail: localStorage.getItem("technicalUserEmail"),
        technicalScore: currentlyScored,
      });

      const hasPassed = response.data.techPass === true || response.data.techPass === "true";
      const templateParams = {
        to_email: localStorage.getItem("technicalUserEmail"),
        name: localStorage.getItem("userName"),
        jobRole,
        companyName,
      };

      if (hasPassed) {
        templateParams.linkForNextRound = `${FRONTEND_URL}/hrRoundEntrance`;
        await sendHREmail(templateParams, true);
        alert("You have successfully completed the Technical round. We will update you through email soon.");
      } else {
        await sendHREmail(templateParams, false);
        alert("Unfortunately, you did not pass the Technical round. We will update you through email soon.");
      }

      window.location.reload();
    } catch (err) {
      console.error("Error ending session:", err);
      alert("Failed to submit. Please try again.");
    }
  };

  const handleTimeExpired = async () => {
    setIsTimerRunning(false);
    alert("Technical round time has expired!");
    handleEndSession();
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    setTestCaseResults([]);

    try {
      const result = await executeCode(selectedLanguage, code);
      const outputText = result.run.output || "No output";
      setOutput(outputText);

      const currentProblem = problems[currentProblemIndex];
      if (currentProblem) {
        const results = handleTestCases(currentProblem, outputText);
        setTestCaseResults(results);
      }
    } catch (err) {
      setError(err.message || "Execution error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitIsRunning(true);
    try {
      const currentProblem = problems[currentProblemIndex];
      const res = await axios.post(`${BACKEND_URL}/checkTechSolution`, {
        title: currentProblem.title,
        desc: currentProblem.desc,
        code,
      });

      const evalObj = res.data?.evaluation;
      if (evalObj?.success) {
        currentlyScored += 1;
      }

      setOutput(evalObj?.summary || "Evaluation complete");
      setError(null);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit solution");
      setOutput("");
    } finally {
      setSubmitIsRunning(false);
    }
  };

  const handleProblemChange = (newIndex) => {
    if (newIndex < 0 || newIndex >= problems.length) return;

    setCodeStore((prev) => ({
      ...prev,
      [currentProblemIndex]: code,
    }));

    setOutput("");
    setError(null);
    setTestCaseResults([]);
    setCurrentProblemIndex(newIndex);
    setCode(codeStore[newIndex] || "");
  };

  // Handle Tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end); // 4 spaces
      setCode(newCode);
      // Move cursor after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // ========== UTILS ==========

  const compareTestCaseOutputs = (expected, actual) => {
    const exp = String(expected).trim();
    const act = String(actual).trim();

    if (exp === act) return true;

    const numExp = Number(exp);
    const numAct = Number(act);
    if (!isNaN(numExp) && !isNaN(numAct) && numExp === numAct) return true;

    const floatExp = parseFloat(exp);
    const floatAct = parseFloat(act);
    if (!isNaN(floatExp) && !isNaN(floatAct) && Math.abs(floatExp - floatAct) < 1e-9) return true;

    const normalize = (s) =>
      s
        .replace(/[\[\]]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map((x) => x.trim())
        .filter(Boolean)
        .join(" ");

    return normalize(exp) === normalize(act);
  };

  const handleTestCases = (problem, output) => {
    if (!problem?.testCases?.length) return [];
    return problem.testCases.map((tc) => {
      const expected = String(tc.expectedOutput || "");
      const actual = String(output || "");
      const input = String(tc.input || "");
      return {
        input,
        expectedOutput: expected,
        actualOutput: actual,
        isCorrect: compareTestCaseOutputs(expected, actual),
      };
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatDescription = (desc) => {
    if (!desc) return null;
    return desc.split("\n").map((line, i) => {
      const l = line.trim();
      const isExample = l.toLowerCase().startsWith("example");
      const isConstraint = l.toLowerCase().startsWith("constraints");
      const isInput = l.toLowerCase().startsWith("input:");
      const isOutput = l.toLowerCase().startsWith("output:");
      const isBullet = l.startsWith("•");

      const baseClass = isDarkMode ? "text-gray-200" : "text-gray-800";
      let colorClass = baseClass;
      let styleClass = "mb-2";

      if (isExample) colorClass = isDarkMode ? "text-blue-400" : "text-blue-600";
      else if (isConstraint) colorClass = isDarkMode ? "text-purple-400" : "text-purple-600";
      else if (isInput) colorClass = isDarkMode ? "text-emerald-400" : "text-emerald-600";
      else if (isOutput) colorClass = isDarkMode ? "text-orange-400" : "text-orange-600";
      else if (isBullet) colorClass = isDarkMode ? "text-gray-300" : "text-gray-600";

      if (isExample || isConstraint) styleClass += " font-semibold text-lg mt-4";
      if (isInput || isOutput) styleClass += " font-medium ml-4";
      if (isBullet) styleClass += " ml-6";

      return (
        <p key={i} className={`${styleClass} ${colorClass}`}>
          {l}
        </p>
      );
    });
  };

  const renderTestCases = () => {
    const problem = problems[currentProblemIndex];
    if (!problem?.testCases?.length) {
      return (
        <div className={`text-center py-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          No test cases available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {problem.testCases.map((tc, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Test Case {idx + 1}
              </span>
              {testCaseResults[idx] &&
                (testCaseResults[idx].isCorrect ? (
                  <CheckCircle2 className="text-green-500 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-500 h-5 w-5" />
                ))}
            </div>
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>
              <span className="font-medium">Input:</span> {String(tc.input || "")}
            </div>
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>
              <span className="font-medium">Expected:</span> {String(tc.expectedOutput || "")}
            </div>
            {testCaseResults[idx] && (
              <div className={testCaseResults[idx].isCorrect ? "text-green-500" : "text-red-500"}>
                <span className="font-medium">Actual:</span> {String(testCaseResults[idx].actualOutput || "")}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ========== RENDER ==========

  if (showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Technical Round
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 border-gray-300 text-gray-800"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 border-gray-300 text-gray-800"
                placeholder="Enter your user ID"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 border-gray-300 text-gray-800"
                placeholder="Enter your email"
              />
            </div>
            {loginError && (
              <div className="mb-4 p-3 rounded-lg text-center bg-red-100 text-red-600">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full p-3 rounded-lg transition-colors bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Start Technical Round
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !problems.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
        {loading ? "Loading problems..." : "No problems found."}
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex] || {};

  return (
    <div className={`min-h-screen min-w-full p-4 flex ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"}`}>
      <div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-2rem)]">
        {/* Left Panel */}
        <div className={`relative rounded-xl shadow-lg p-4 flex flex-col overflow-hidden ${isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button onClick={handleEndSession} className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-700 hover:bg-red-800 text-white"}`}>
                End Session
              </button>
              <div className={`flex items-center px-4 py-2 rounded-full ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"} ${remainingTime <= 60 ? "animate-pulse text-red-500" : ""}`}>
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-mono text-sm">{formatTime(remainingTime)}</span>
              </div>
              <button
                onClick={() => handleProblemChange(currentProblemIndex - 1)}
                disabled={currentProblemIndex === 0}
                className={`p-2 rounded-full ${currentProblemIndex === 0 ? "opacity-50 cursor-not-allowed" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              >
                <ChevronLeft className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
              </button>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Problem {currentProblemIndex + 1} of {problems.length}
              </span>
              <button
                onClick={() => handleProblemChange(currentProblemIndex + 1)}
                disabled={currentProblemIndex === problems.length - 1}
                className={`p-2 rounded-full ${currentProblemIndex === problems.length - 1 ? "opacity-50 cursor-not-allowed" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              >
                <ChevronRight className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
              </button>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"}`}>
            {currentProblem.title}
          </h1>
          <div className="prose max-w-none overflow-y-auto pr-2">
            {formatDescription(currentProblem.desc)}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 h-full">
          <div className={`rounded-xl shadow-lg p-4 flex-1 flex flex-col ${isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"}`}>
            <div className="flex justify-between items-center mb-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`w-48 p-2 rounded-md ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-100 border-gray-300 text-gray-800"}`}
              >
                {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitRunning}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"}`}
                >
                  <Play className="h-4 w-4" />
                  {isSubmitRunning ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"}`}
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running..." : "Run Code"}
                </button>
              </div>
            </div>
            <div className={`rounded-lg overflow-hidden flex-1 ${isDarkMode ? "border border-gray-700 bg-gray-900/50" : "border border-gray-300 bg-gray-50"}`}>
              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown} // Tab handling
                className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                spellCheck="false"
                placeholder="Write your code here..."
              />
            </div>
          </div>

          {/* Output & Test Cases */}
          <div className="flex gap-4 h-[250px]">
            <div className={`w-1/2 rounded-xl shadow-lg p-4 ${isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400" : "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"}`}>
                Output
              </h2>
              {error && (
                <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? "bg-red-900/50 border-red-700" : "bg-red-100 border-red-200"}`}>
                  <div className="flex items-center">
                    <AlertCircle className={isDarkMode ? "text-red-400 h-4 w-4" : "text-red-600 h-4 w-4"} />
                    <div className={isDarkMode ? "ml-2 font-semibold text-red-400" : "ml-2 font-semibold text-red-600"}>Error</div>
                  </div>
                  <div className={isDarkMode ? "mt-2 text-red-200" : "mt-2 text-red-700"}>{error}</div>
                </div>
              )}
              <pre
                className={`p-4 rounded-lg h-32 overflow-auto font-mono text-sm ${isDarkMode ? "bg-gray-900/50 border border-gray-700 text-gray-200" : "bg-gray-50 border border-gray-300 text-gray-800"}`}
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {output || "Run your code to see the output here..."}
              </pre>
            </div>
            <div className={`w-1/2 rounded-xl shadow-lg p-4 overflow-auto ${isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"}`}>
                Manual Test Cases
              </h2>
              {renderTestCases()}
            </div>
          </div>
        </div>
      </div>

      {showCheatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Cheating Detected</h2>
            <p className="mb-6">
              You have been detected switching tabs or minimizing the browser during the technical round.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Exit — You have been rejected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechRound;