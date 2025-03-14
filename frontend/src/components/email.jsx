import emailjs from "@emailjs/browser";

const sendEmail = async (templateParams) => {
  const serviceID = "service_7z4e8tp"; 
  const templateID = "template_93xwc5o"; 
  const publicKey = "ykjMUB8SVSHI0-C3w"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmail;

// from aniket52kr2004@gmail.com        mail for apptitude test      from hrroundinfo.jsx    single done
// done email send
// apptitude email send