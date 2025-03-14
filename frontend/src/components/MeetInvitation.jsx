
import emailjs from "@emailjs/browser";

const sendMeetInvitation = (templateParams) => {
  const serviceID = "service_x444fac"; 
  const templateID = "template_0zi9x4f"; 
  const publicKey = "ZFwv-IudmD_mMN1V3"; 

  return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendMeetInvitation;




// from  aniketbawankar70@gmail.com           HRRound.jsx              single       done
// done email send
// meet invitation email send