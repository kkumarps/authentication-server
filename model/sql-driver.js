import mysql from "mysql2";
import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { customResponse } from "../messages/custom-response.js";
import { config } from "../util/config.js";

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename),
  schemaFilePath = join(__dirname, "schemas/create_db.sql");

let conn;

async function createConn() {
  try {
    conn = mysql
      .createPool({
        host: config.sqlHost,
        user: config.sqlUserId,
        password: config.sqlPass,
        multipleStatements: true,
      })
      .promise();

    const data = await fs.readFile(schemaFilePath, "utf-8");

    await conn.query(data);

    return 1;
    //
  } catch (error) {
    console.error(error);

    return 0;
  }
}

class SQLDriver {
  constructor(data, table) {
    this.data = data;
    this.table = table;
    this.values = [];
  }

  async create() {
    let query;

    if (this.table === "registered_users") {
      const { email, name, password } = this.data;
      query = `INSERT INTO ${this.table} (email, name, password) VALUES (?, ?, ?)`;
      this.values.length = 0;
      this.values.push(email);
      this.values.push(name);
      this.values.push(password);
      //
    } else if (this.table === "tokens") {
      const { email, token } = this.data;
      query = `USE user_data; INSERT INTO ${this.table} (email, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)`;
      this.values.length = 0;
      this.values.push(email);
      this.values.push(token);
      //
    } else if (this.table === "signup") {
      const { email, name, password, otp } = this.data;
      query = `INSERT INTO ${this.table} (email, name, password, otp) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), otp = VALUES(otp)`;
      this.values.length = 0;
      this.values.push(email);
      this.values.push(name);
      this.values.push(password);
      this.values.push(otp);
      //
    } else if (this.table === "categories_preference") {
      const { email, preference } = this.data;

      query = `INSERT INTO ${this.table} (email, preference) VALUES (?, ?) ON DUPLICATE KEY UPDATE preference = VALUES(preference)`;
      this.values.length = 0;
      this.values.push(email);
      this.values.push(preference);

      //
    } else throw error;

    try {
      await conn.query(query, this.values);

      return customResponse(201, `Data added successfully`);
    } catch (error) {
      console.error(error);
      if (error.errno === 1062) return customResponse(409, "ID exists already");
      else
        return customResponse(
          500,
          "Internal server error. Please try again later."
        );
    }
  }

  async read() {
    const query = `SELECT * FROM ${this.table} WHERE email = ?`;

    try {
      const result = await conn.query(query, [this.data.email]);
      if (!result[0][0]) return customResponse(404, "Id not found");
      return customResponse(200, result[0][0]);
    } catch (error) {
      console.error(error.message);
      return customResponse(
        500,
        "Internal server error. Please try again later."
      );
    }
  }

  async delete() {
    const query = `DELETE FROM ${this.table} WHERE email = ?`;

    try {
      const result = await conn.query(query, [this.data.email]);
      if (!result[0][0]) return customResponse(404, "Id not found");
      console.log(result);
      return customResponse(200, result[0][0]);
    } catch (error) {
      console.error(error.message);
      return customResponse(
        500,
        "Internal server error. Please try again later."
      );
    }
  }
}

export { createConn, SQLDriver };
