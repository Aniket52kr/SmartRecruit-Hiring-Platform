// updated code:-
import emailjs from "@emailjs/browser";

// Function to send rejection email
const CheatingEmail = async (templateParams) => {
  const serviceID = "service_7z4e8tp"; // Replace with your EmailJS service ID
  const templateID = "template_nhdkevf"; // Replace with your EmailJS template ID
  const publicKey = "ykjMUB8SVSHI0-C3w"; // Replace with your EmailJS user ID

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



// form dashboard.jsx           single         done template
// send email when candidate was doing some cheating during exam
// done solve error