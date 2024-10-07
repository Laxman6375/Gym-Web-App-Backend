const otpTemplate = require("../mail/template/verificationTemplate");
const mailSender = require("./mailSender");

const sendVerificationEmail = async ({email, otp}) =>{
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email from Royal Gym",
        otpTemplate(otp)
      );
       console.log("Email Sent Successfully : ", mailResponse);
    } catch (error) {
       console.log("error occured while sending mails:".error);
      throw error;
    }
  }

  module.exports = sendVerificationEmail;