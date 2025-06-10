import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendProgressEmail = (templateParams) => {
  const serviceID = "service_tvdz0ew"; // Replace with your EmailJS service ID
  const templateID = "template_qwwvaf6"; // Replace with your EmailJS template ID
  const publicKey = "iw-rn4Ty2NAmlabDW"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendProgressEmail;

//   form QuizRound.jsx           double          done template
// done email send
// nextround email send