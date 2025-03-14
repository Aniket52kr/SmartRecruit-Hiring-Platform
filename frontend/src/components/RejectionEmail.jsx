import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendRejectionEmail = (templateParams) => {
  const serviceID = "service_tvdz0ew"; // Replace with your EmailJS service ID
  const templateID = "template_l487yna"; // Replace with your EmailJS template ID
  const publicKey = "iw-rn4Ty2NAmlabDW"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendRejectionEmail;

// from aniket52kr.01@gmail.com       from quizround.jsx          double            done 
// done email send
// test fail email send