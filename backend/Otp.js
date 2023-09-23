import twilio from "twilio";

const client = new twilio(
  "ACb316103c2548187fa72d3e5f25ad8e9d",
  "f02952cfed32b090d44fbfcf848a4984"
);

  function sendSMS(mobileNumber,service) {
  let toNumber;
  if (mobileNumber.startsWith("+91")) {
    toNumber = mobileNumber;
  } else {
    const cleanNumber = mobileNumber.replace(/\D/g, "");
    toNumber = "+91" + cleanNumber;
  }

  client.messages
    .create({
      from: "+12707431151",
      body: `Thank you for submitting your enquiry for ${service}. We acknowledge that we have received your response successfully. Our team will review your enquiry and get back to you shortly.`,
      to: toNumber,
    })
    .then((message) => console.log(`Message sent with SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending message: ${error.message}`));
}

export { sendSMS };


