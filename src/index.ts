import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { PORT } from "./config";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.route";
import { connectDatabase } from "./database/mongodb";

dotenv.config()
const app : Application= express();
let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3005"]
}
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(bodyParser.json());

app.use('/api/auth', authRouter);

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`app is running on: http://localhost:${PORT}`)
  })
}

startServer();
// import express, { Application } from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { PORT } from "./config";

// import authRouter from "./routes/auth.route";
// import { connectDatabase } from "./database/mongodb";

// dotenv.config();

// const app: Application = express();

// // Middleware
// app.use(bodyParser.json());

// // ✅ FIXED ROUTE (VERY IMPORTANT)
// app.use("/api/v1/auth", authRouter);

// async function startServer() {
//   await connectDatabase();
//   // Listen on all network interfaces (0.0.0.0) to accept connections from Android emulator
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`✅ Server is running on: http://localhost:${PORT}`);
//     console.log(`📱 Android emulator can access at: http://10.0.2.2:${PORT}`);
//     console.log(`🌐 Network access available at: http://0.0.0.0:${PORT}`);
//   });
// }

// Start the server
// startServer();

