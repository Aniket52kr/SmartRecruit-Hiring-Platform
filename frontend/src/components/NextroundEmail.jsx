import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendProgressEmail = (templateParams) => {
  const serviceID = "service_o19uk2u"; // Replace with your EmailJS service ID
  const templateID = "template_wadbt4a"; // Replace with your EmailJS template ID
  const publicKey = "fPI1n7fmMRaAABj8h"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendProgressEmail;

//   form QuizRound.jsx           double          done template
// done email send
// nextround email send