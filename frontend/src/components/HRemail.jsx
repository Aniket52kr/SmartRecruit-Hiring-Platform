import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendHREmail = (templateParams) => {
  const serviceID = "service_2bhyxcj"; // Replace with your EmailJS service ID
  const templateID = "template_9goc0ar"; // Replace with your EmailJS template ID
  const publicKey = "HDP4ltso_ZkdSEGKc"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendHREmail;




// from  caniketbawankar@gmail.com          from TechRound.jsx              single
// this template is use for successfully pass the technical round 