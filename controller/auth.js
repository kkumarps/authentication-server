import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { SQLDriver } from "../model/sql-driver.js";
import { customResponse } from "../messages/custom-response.js";
import { sendOTP } from "../util/mailer.js";
import { config } from "../util/config.js";

class Auth {
  #data;
  constructor(data) {
    this.#data = data;
  }

  async signup() {
    this.#data.password = await bcrypt.hash(this.#data.password, 10);

    const sqlDriver = new SQLDriver(this.#data, "registered_users"),
      checkExistingId = await sqlDriver.read();

    if (checkExistingId.status === 200)
      return customResponse(404, "Id exists already. Please login");

    sqlDriver.table = "signup";

    const otp = Math.floor(1000 + Math.random() * 9000);
    sqlDriver.data.otp = otp;

    const result = await sqlDriver.create();

    if (result.status !== 201) return result;

    sendOTP(otp);

    return customResponse(201, "Check your email for OTP");
  }

  async validateOTP() {
    const sqlDriver = new SQLDriver(this.#data, "signup"),
      fetchSavedData = await sqlDriver.read();

    if (fetchSavedData.status === 404) return fetchSavedData;

    if (parseInt(this.#data.otp) !== fetchSavedData.message.otp)
      return customResponse(401, "Invalid OTP");

    sqlDriver.data = fetchSavedData.message;
    delete sqlDriver.data.otp;
    sqlDriver.table = "registered_users";

    const addUserAsRegistered = await sqlDriver.create();

    if (addUserAsRegistered.status !== 201) return addUserAsRegistered;

    sqlDriver.table = "signup";
    sqlDriver.delete();

    const token = this.#tokenGen();

    const saveToken = { email: this.#data.email, token: token };

    sqlDriver.table = "tokens";
    sqlDriver.data = saveToken;

    const result = await sqlDriver.create();

    return customResponse(200, token);
  }

  async login() {
    const sqlDriver = new SQLDriver(this.#data, "registered_users"),
      savedUserData = await sqlDriver.read();

    if (savedUserData.status !== 200) return savedUserData;

    const isPasswordValid = await bcrypt.compare(
      this.#data.password,
      savedUserData.message.password
    );

    if (isPasswordValid) {
      const token = this.#tokenGen();

      const saveToken = { email: this.#data.email, token: token };

      const sqlDriver = new SQLDriver(saveToken, "tokens"),
        result = await sqlDriver.create();

      return customResponse(200, token);
    } else return customResponse(401, "Autentication failed");
  }

  async logout() {
    const emailId = this.#extractEmailId();

    const sqlDriver = new SQLDriver({ email: emailId }, "tokens");
    await sqlDriver.delete();

    return customResponse(200, "Token cleared");
  }

  #extractEmailId() {
    const decoded = jwt.verify(this.#data, config.jwtSecretKey);
    return decoded.email;
  }

  #tokenGen() {
    return jwt.sign({ email: this.#data.email }, config.jwtSecretKey, {
      expiresIn: "1h",
    });
  }
}

export { Auth };
