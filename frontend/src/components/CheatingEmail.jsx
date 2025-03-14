// import emailjs from "@emailjs/browser";

// // Function to send rejection email
// const CheatingEmail = async (templateParams) => {
//   const serviceID = "service_2bhyxcj"; // Replace with your EmailJS service ID
//   const templateID = "template_yin2srs"; // Replace with your EmailJS template ID
//   const publicKey = "HDP4ltso_ZkdSEGKc"; // Replace with your EmailJS user ID

//   // Validate recipient email before sending
//   if (!templateParams.to_email) {
//     console.error("Error: Recipient email is missing.");
//     return Promise.reject(new Error("Recipient email is missing."));
//   }

//   try {
//     const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
//     console.log("Email successfully sent!", response);
//     return response;
//   } catch (error) {
//     console.error("EmailJS error:", error);
//     return Promise.reject(error);
//   }
// };

// export default CheatingEmail;








// updated code:-
import emailjs from "@emailjs/browser";

// Function to send rejection email
const CheatingEmail = async (templateParams) => {
  const serviceID = "service_2bhyxcj"; // Replace with your EmailJS service ID
  const templateID = "template_yin2srs"; // Replace with your EmailJS template ID
  const publicKey = "HDP4ltso_ZkdSEGKc"; // Replace with your EmailJS user ID

  // Debugging log: check the template parameters
  console.log("Email Params:", templateParams);

  // Validate recipient email before sending
  if (!templateParams.to_email || templateParams.to_email.trim() === "") {
    console.error("Error: Recipient email is missing.");
    return Promise.reject(new Error("Recipient email is missing."));
  }

  try {
    const response = await emailjs.send(
      serviceID,
      templateID,
      {
        ...templateParams,
        to_email: templateParams.to_email.trim(), // Ensure no accidental spaces
      },
      publicKey
    );

    console.log("Email successfully sent!", response);
    return response;
  } catch (error) {
    console.error("EmailJS error:", error);
    return Promise.reject(error);
  }
};

export default CheatingEmail;



// from caniketbawankar@gmail.com           form dashboard.jsx           single         done template
// send email when candidate was doing some cheating during exam




// done solve error