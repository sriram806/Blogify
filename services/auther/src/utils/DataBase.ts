import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

export const sql = neon(process.env.DB_URL as string);

async function initDB() {
    try {
        await sql
            `CREATE TABLE IF NOT EXISTS blogs(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                blog_content TEXT NOT NULL,
                author VARCHAR(100) NOT NULL,
                image_url TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql
            `CREATE TABLE IF NOT EXISTS comments(
                id SERIAL PRIMARY KEY,
                comment VARCHAR(255) NOT NULL,
                userid VARCHAR(255) NOT NULL,
                username VARCHAR(100) NOT NULL,
                blogid VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql
            `CREATE TABLE IF NOT EXISTS savedblogs(
                id SERIAL PRIMARY KEY,
                userid VARCHAR(255) NOT NULL,
                blogid VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`

        console.log(`Database Initialized Successfully!`);
    } catch (error: any) {
        console.log(`Error Initializing Database: ${error.message}`);
    }
}

export { initDB };