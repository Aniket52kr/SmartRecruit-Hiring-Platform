import emailjs from "@emailjs/browser";

// Function to send HR emails (both success and failure)
const sendHREmail = async (templateParams, hasPassed) => {
  const serviceID = "service_2bhyxcj"; // Replace with your EmailJS service ID
  const publicKey = "HDP4ltso_ZkdSEGKc"; // Replace with your EmailJS user ID

  // Dynamically select the template ID based on whether the candidate passed or failed
  const templateID = hasPassed
    ? "template_9goc0ar" // Replace with your success email template ID
    : "template_hpmkazh"; // Replace with your failure email template ID

  try {
    // Send the email using EmailJS
    await emailjs.send(serviceID, templateID, templateParams, publicKey);
    console.log(`${hasPassed ? "Success" : "Failure"} email sent successfully!`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

export default sendHREmail;




// from TechRound.jsx              single
// this template is use for successfully pass the technical round         done
// this template is use for successfully fail the technical round         done