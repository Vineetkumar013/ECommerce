const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const OTP = require("../models/otpModel");
const ErrorHander = require("./errorhander");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authPhone = process.env.TWILIO_ACCOUNT_PHONE;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});

const sendSMS = async (phone, message) => {
  return;
  try{
    const response = await client.messages.create({
      body: message,
      from: authPhone,
      to: `=+91${phone}`,
    });
  }catch(error){
    console.log(error);
    throw error;
  }
};

const verifySMS = async (userId, otp) => {
  const verify = await OTP.findOne({
    user: userId,
    otp,
    expires: { $gt: Date.now() },
  });

  if (!verify) {
    const error = "Invalid OTP or expires !";
    return { error };
  }

  verify.save();
  return verify;
};

const sendCustomSMS = async ({ phone, message }) => {
  const response = await client.messages.create({
    body: message,
    from: authPhone,
    to: `=+91${phone}`,
  });
  return response;
};

module.exports = {
  sendSMS,
  verifySMS,
};
