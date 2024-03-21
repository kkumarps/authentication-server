import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

import { SQLDriver } from "../model/sql-driver.js";
import { customResponse } from "../messages/custom-response.js";
import { config } from "../util/config.js";

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(dirname(__filename)),
  categoriesData = join(__dirname, "data/gen-data-categories.json");

const data = JSON.parse(await readFile(categoriesData, "utf-8"));

async function getTotalCount() {
  return customResponse(200, Math.floor(data.length / 10).toString());
}

async function getCategoryList(page = 1) {
  try {
    if (data.length === 0) return customResponse(404, "No data in the db");

    const count = page * 10,
      start = count - 10,
      end = count;

    const slicedData = data.slice(start, end);

    return customResponse(200, slicedData);
  } catch (error) {
    console.error(error.message);
    return customResponse(500, "Internal server error");
  }
}

async function savePreference(token, data) {
  try {
    function extractEmailId(token) {
      const decoded = jwt.verify(token, config.jwtSecretKey);
      return decoded.email;
    }

    const emailId = extractEmailId(token);

    let stringifiedIds = data[0];

    for (let i = 1; i < data.length; i++) {
      stringifiedIds = stringifiedIds + "," + data[i];
    }

    const savePreference = { email: emailId, preference: stringifiedIds };

    const sqlDriver = new SQLDriver(savePreference, "categories_preference");
    const result = await sqlDriver.create();

    if (result.status === 201) return customResponse(200, "Preference saved");
    else return result;
  } catch (error) {
    console.error(error.message);
    return customResponse(500, "Internal server error");
  }
}

export { getCategoryList, getTotalCount, savePreference };
