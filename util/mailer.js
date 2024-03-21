import nodemailer from "nodemailer";

import { config } from "../util/config.js";

async function sendOTP(otp) {
  const transport = nodemailer.createTransport({
    host: config.mailHost,
    port: 465,
    secure: true,
    auth: {
      user: config.mailUserId,
      pass: config.mailPass,
    },
  });

  const info = await transport.sendMail({
    from: config.mailUserId,
    to: "",
    subject: "Welcome to abc store - SignUp OTP",
    text: `Greetings,
    Here's the OTP to register your email: ${otp}`,
  });

  console.log(`OTP sent successfully. Message id: ${info.messageId}`);
}

export { sendOTP };
