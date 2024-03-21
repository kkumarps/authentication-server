import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  mailHost: process.env.MAIL_HOST,
  mailUserId: process.env.MAIL_USERID,
  mailPass: process.env.MAIL_PASSWORD,
  sqlHost: process.env.SQL_HOST,
  sqlUserId: process.env.SQL_USERID,
  sqlPass: process.env.SQL_PASSWORD,
};

export { config };
