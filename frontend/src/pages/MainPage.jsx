// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";

// const MainPage = () => {
//   const [isEmail, setIsEmail] = useState(""); // Fixed camelCase naming
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsEmail(localStorage.getItem("email") || ""); // Optimized state update
//   }, []); // Removed isEmail from dependency array to prevent re-renders

//   const handleButtonClick = () => {
//     navigate(isEmail ? "/recruiter" : "/signup");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-gradient-to-b from-white to-blue-50 h-full">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
//           <div className="text-center space-y-8">
//             {/* Main Title */}
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
//               Transform Your Hiring
//               <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 With AI-Powered Recruitment
//               </span>
//             </h1>

//             {/* Subtitle */}
//             <p className="max-w-2xl mx-auto text-xl text-gray-600">
//               Streamline your recruitment process with automated scheduling,
//               candidate management, and seamless hiring workflows.
//             </p>

//             {/* CTA button */}
//             <div className="mt-10">
//               <button
//                 onClick={handleButtonClick}
//                 className="relative font-extrabold text-xl tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-800 active:to-blue-700 text-white px-10 py-6 rounded-full shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 hover:scale-[1.02] active:scale-[0.98]"
//               >
//                 Create a Smart Recruit
//               </button>
//             </div>

//             {/* Optional Stats or Social Proof */}
//             <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
//               <div>
//                 <div className="text-4xl font-bold text-blue-600">100%</div>
//                 <div className="text-gray-600 mt-1">Interview Validation</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold text-blue-600">3</div>
//                 <div className="text-gray-600 mt-1">Interview Rounds</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold text-blue-600">24/7</div>
//                 <div className="text-gray-600 mt-1">AI-Powered Support</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MainPage;






import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


const MainPage = () => {
  const [isEmail, setIsEmail] = useState("");
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setIsEmail(localStorage.getItem("email") || "");
  }, []);

  const handleButtonClick = () => {
    navigate(isEmail ? "/recruiter" : "/signup");
  };


  // FAQ Question and toggle event:-
  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqs = [
    {
      question: "How does AI-powered recruitment work?",
      answer:
        "AI-powered recruitment uses machine learning algorithms to automate candidate screening, schedule interviews, and assess candidate fit based on skills and experience.",
    },
    {
      question: "Is my data secure with SmartRecruit?",
      answer:
        "Yes, we prioritize data privacy and security. Our platform uses encryption and industry-standard security protocols.",
    },
    {
      question: "Can I customize the recruitment process?",
      answer:
        "Absolutely! You can customize interview rounds, assessment criteria, and automate specific parts of the hiring workflow.",
    },
    {
      question: "What languages are supported in coding assessments?",
      answer:
        "SmartRecruit supports multiple languages including JavaScript, Python, Java, C++, and more for coding assessments.",
    },
    {
      question: "Do you offer real-time candidate monitoring?",
      answer:
        "Yes, we have real-time face detection and monitoring to prevent fraudulent activities during assessments.",
    },
  ];


  return (
    <>
      <Navbar />

      {/* Main Section */}
      <div id="Home" className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Transform Your Hiring
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                With AI-Powered Recruitment
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Streamline your recruitment process with automated scheduling,
              candidate management, and seamless hiring workflows.
            </p>

            <div className="mt-10">
              <button
                onClick={handleButtonClick}
                className="relative font-extrabold text-xl tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-6 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                Create a Smart Recruit
              </button>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600 mt-1">Interview Validation</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">3</div>
                <div className="text-gray-600 mt-1">Interview Rounds</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600 mt-1">AI-Powered Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Our Vision Section */}
      <div id="vision" className="bg-white py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Vision</h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            At <span className="font-semibold">SmartRecruit</span>, we envision a future where 
            recruitment is smarter, faster, and more efficient. Our goal is to empower companies 
            with AI-driven automation, ensuring they find the right talent quickly and accurately. 
            By leveraging advanced technologies, we strive to enhance candidate experiences 
            and streamline the hiring process for businesses of all sizes.
          </p>
        </div>
      </div>


      {/* Features Section */}
      <div id="Features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            Key Features
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Feature 1 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                Aptitude Auto-Validation
              </h3>
              <p className="text-gray-600 mt-4">
                Intelligent assessments with automated scoring and cheat
                prevention mechanisms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                Technical/Coding Assessment
              </h3>
              <p className="text-gray-600 mt-4">
                Real-time multi-language code execution and automatic
                evaluation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                HR Interview Round
              </h3>
              <p className="text-gray-600 mt-4">
                Real-time video interviews with screen sharing and recording
                capabilities.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                Intelligent Face Detection
              </h3>
              <p className="text-gray-600 mt-4">
                Real-time monitoring with unauthorized user detection.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                Automated Communication
              </h3>
              <p className="text-gray-600 mt-4">
                Instant email notifications and personalized candidate
                communication.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 mt-4">
                Gain insights into recruitment performance with detailed
                analytics.
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* FAQ Section */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-2xl font-semibold text-blue-600 flex justify-between items-center">
                  {faq.question}
                  <span className="text-gray-400">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </h3>

                {openIndex === index && (
                  <p className="text-gray-600 mt-4 transition-all duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>  


      {/* Footer Section */}
      <footer id="contact" className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold">About SmartRecruit</h3>
            <p className="mt-4 text-gray-400">
              SmartRecruit is a leading AI-based recruitment platform, helping
              companies streamline their hiring processes with innovative
              technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#Home" className="text-blue-400 hover:underline">Home</a>
              </li>
              <li>
                <a href="#vision" className="text-blue-400 hover:underline">Our Vision</a>
              </li>
              <li>
                <a href="#Features" className="text-blue-400 hover:underline">Features</a>
              </li>
              <li>
                <a href="#contact" className="text-blue-400 hover:underline">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="mt-4 text-gray-400">Email: support@smartrecruit.com</p>
            <p className="text-gray-400">Phone: +91 9284702879</p>
            <p className="text-gray-400">Location: Pune, India</p>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} SmartRecruit. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default MainPage;