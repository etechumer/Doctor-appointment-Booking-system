import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import getPool from "./db/db.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", rootRouter);

const createServer = async () => {
  try {
    await getPool(); // Ensure the database connection is established before starting the server
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
  }
};

createServer();
