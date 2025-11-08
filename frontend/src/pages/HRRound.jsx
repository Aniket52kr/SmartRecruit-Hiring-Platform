import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import sendMeetInvitation from "../components/MeetInvitation";


export default function HRRound() {
  const { id, candidateEmail } = useParams();
  const roomID = id;
  const meetingContainerRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
        setCompanyName(response.data.companyName);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };
    fetchCandidateData();
  }, [BACKEND_URL]);


  // Toast styling and loader styling (same as your previous design)
  const addGlobalStyles = () => {
    if (document.getElementById("meeting-styles")) return;

    const style = document.createElement("style");
    style.id = "meeting-styles";
    style.textContent = `
      .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: transparent;
        border-radius: 50%;
        animation: rotation 1s linear infinite;
      }

      @keyframes rotation {
        0% { transform: rotate(0deg) }
        100% { transform: rotate(360deg) }
      }

      .custom-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s ease;
        z-index: 1001;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-family: sans-serif;
      }

      .custom-toast.error {
        background-color: #f44336;
      }

      .custom-toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .send-invite-btn {
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        transition: background 0.2s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      }

      .send-invite-btn:hover:not(:disabled) {
        background-color: #1e4fd1;
      }

      .send-invite-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  };


  const showToast = (message, type = "success") => {
    addGlobalStyles();
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type === "error" ? "error" : ""}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };


  const sendMeetingLink = async () => {
    if (sent) {
      showToast("Invitation already sent to this candidate.");
      return;
    }

    const recipient = candidateEmail || localStorage.getItem("candidateEmailForMeet");
    if (!recipient) {
      showToast("Candidate email is missing.", "error");
      return;
    }

    addGlobalStyles();
    const loader = document.createElement("div");
    loader.classList.add("loader-container");
    loader.innerHTML = `<div class="loader"></div>`;
    document.body.appendChild(loader);

    const meetingLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    const templateParams = {
      meet_link: meetingLink,
      company_name: companyName,
      to_email: recipient,
    };

    try {
      await sendMeetInvitation(templateParams);
      setSent(true);
      showToast("Email successfully sent to the candidate!");
    } catch (err) {
      console.error("Email sending failed:", err);
      showToast("Failed to send email. Please try again.", "error");
    } finally {
      loader.remove();
    }
  };


  useEffect(() => {
    if (meetingContainerRef.current) {
      const appID = 540302240;
      const serverSecret = "fff3234c920f356da70dda88c0f5ff3f"; 

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        "Enter Your Name"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetingContainerRef.current,
        sharedLinks: [
          {
            name: "Copy link",
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    }

    addGlobalStyles();
  }, [roomID]);

  return (
    <div className="relative h-screen">
      <div ref={meetingContainerRef} className="h-full" />
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <button
          className="send-invite-btn"
          onClick={sendMeetingLink}
          disabled={sent}
        >
          {sent ? "Invitation Sent" : "📧 Send Meeting Invitation"}
        </button>
      </div>
    </div>
  );
}             