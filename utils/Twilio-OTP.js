require("dotenv").config();

const sendOTP = async (phone, message) => {
  // Use your preferred SMS gateway API to send the OTP to the user's phone number
  // Here is an example using the Twilio API

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioClient = require("twilio")(accountSid, authToken);

  try {
    const messageResult = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(messageResult.sid);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = sendOTP;