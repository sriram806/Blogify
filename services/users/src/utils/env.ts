import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE = process.env.NODE_ENV || "development";
const candidates = [
  `.env.${NODE}.local`,
  `.env.${NODE}`,
  `.env.local`,
  `.env`,
];

let loaded = false;
for (const file of candidates) {
  const full = path.resolve(process.cwd(), file);
  if (fs.existsSync(full)) {
    config({ path: full });
    loaded = true;
    break;
  }
}

if (!loaded) {
  const serverEnvPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(serverEnvPath)) {
    config({ path: serverEnvPath });
  }
}

export const {
    PORT,
    NODE_ENV,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_PASS,
    SMTP_SERVICE,
    SMTP_EMAIL
} = process.env;