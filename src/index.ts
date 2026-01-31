// for web app
// import express, { Application } from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { PORT } from "./config";
// import cors from "cors";
// import morgan from "morgan";

// import authRouter from "./routes/auth.route";
// import { connectDatabase } from "./database/mongodb";

// dotenv.config()
// const app : Application= express();
// let corsOptions = {
//   origin: ["http://localhost:3000", "http://localhost:3005"]
// }
// app.use(cors(corsOptions));
// app.use(morgan("dev"));

// app.use(bodyParser.json());

// app.use('/api/auth', authRouter);

// async function startServer() {
//   await connectDatabase();
//   app.listen(PORT, () => {
//     console.log(`app is running on: http://localhost:${PORT}`)
//   })
// }

// startServer();

//for mobile app 
// import express, { Application } from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { PORT } from "./config";

// import authRouter from "./routes/auth.route";
// import uploadRouter from "./routes/upload.route";
// import { connectDatabase } from "./database/mongodb";

// dotenv.config();

// const app: Application = express();

// // Middleware
// app.use(bodyParser.json());

// // ✅ FIXED ROUTE (VERY IMPORTANT)
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/upload", uploadRouter);
// app.use('/uploads', express.static('uploads')); // Serve static files from uploads directory

// async function startServer() {
//   await connectDatabase();
//   // Listen on all network interfaces (0.0.0.0) to accept connections from Android emulator
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`✅ Server is running on: http://localhost:${PORT}`);
//     console.log(`📱 Android emulator can access at: http://10.0.2.2:${PORT}`);
//     console.log(`🌐 Network access available at: http://0.0.0.0:${PORT}`);
//   });
// }


// startServer();

import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PORT } from "./config";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.route";
import uploadRouter from "./routes/upload.route";
import { connectDatabase } from "./database/mongodb";
import { Server } from "tls";

dotenv.config();
const app: Application = express();

// ✅ CORS options
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3005", "http://localhost:5000"]
};
app.use(cors(corsOptions));

// ✅ Logger
app.use(morgan("dev"));

// ✅ JSON parser
app.use(bodyParser.json());

// ✅ Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/upload", uploadRouter);

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Listen on all network interfaces (for emulator and physical devices)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on: http://localhost:${PORT}`);
      console.log(`📱 Android emulator can access at: http://10.0.2.2:${PORT}`);
      console.log(`🌐 Network access available at: http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
}

// Start the server
startServer();
