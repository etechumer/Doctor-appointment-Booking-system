import sql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
};

let pool;

export default async function getPool() {
  try {
    if (pool) {
      return pool;
    }

    pool = sql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log("Connected to MySQL Server");
    connection.release();

    return pool;
  } catch (err) {
    console.error("Error connecting to MySQL Server:", err);
    throw err;
  }
}

export { sql };
