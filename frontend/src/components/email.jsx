import emailjs from "@emailjs/browser";

const sendEmail = async (templateParams) => {
  const serviceID = "service_x444fac"; 
  const templateID = "template_5ospemc"; 
  const publicKey = "ZFwv-IudmD_mMN1V3"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmail;

// from aniketbawankar70@gmail.com        mail for apptitude test      from hrroundinfo.jsx    single done
// done email send
// apptitude email send