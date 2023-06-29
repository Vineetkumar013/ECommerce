
const generateOTP = () => {
  // Generate a 4-digit random number
  const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return otp.toString();
};



module.exports = {
  // generateJwtToken,
  generateOTP,
};
