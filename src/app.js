import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./v1/routes/auth.routes.js";
import channelRoutes from "./v1/routes/channel.routes.js";
import testRoutes from "./v1/routes/test.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/channel", channelRoutes);
app.use("/api/v1/test", testRoutes);

export default app;
