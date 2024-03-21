import { faker } from "@faker-js/faker";
import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(dirname(__filename)),
  genDataFilePath = join(__dirname, "data/gen-data-categories.json");

const numCategories = 100;

// Function to generate a list of shopping categories
function generateCategories() {
  const categories = [];
  for (let i = 0; i < numCategories; i++) {
    const category = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
    };

    categories.push(category);
  }

  fs.writeFile(genDataFilePath, JSON.stringify(categories, null, 2), (err) => {
    if (err) console.error(err.message);
    console.log(`Categories data generated`);
  });

  return;
}

//generateCategories();
