import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_7z4e8tp"; // Replace with your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = "template_1sz1opo"; // Replace with your EmailJS Template ID
const EMAILJS_PUBLIC_KEY = "ykjMUB8SVSHI0-C3w"; // Replace with your EmailJS Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendCustomEmail = async (toEmail, message) => {
  try {
    const templateParams = {
      to_email: toEmail,
      message: message,
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return true; // Success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Failure
  }
};





// from dashboard.jsx
// send custom message from recruiter through email 
// Done sending email