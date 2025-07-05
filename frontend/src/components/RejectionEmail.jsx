import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendRejectionEmail = (templateParams) => {
  const serviceID = "service_o19uk2u"; // Replace with your EmailJS service ID
  const templateID = "template_utob70m"; // Replace with your EmailJS template ID
  const publicKey = "fPI1n7fmMRaAABj8h"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendRejectionEmail;

//   from quizround.jsx          double            done 
// done email send
// test fail email send