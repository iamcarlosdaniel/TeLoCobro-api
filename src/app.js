import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { apiReference } from "@scalar/express-api-reference";

import authRoutes from "./v1/routes/auth.routes.js";
import profileRoutes from "./v1/routes/user.routes.js";
import channelRoutes from "./v1/routes/channel.routes.js";
import testRoutes from "./v1/routes/test.routes.js";

import OpenApiSpecification from "./openapi.json" with {type: "json"}

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
app.set('trust proxy', true);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", profileRoutes);
app.use("/api/v1/channel", channelRoutes);
app.use("/api/v1/test", testRoutes);

app.use(
  "/api/v1/reference",
  apiReference({
    theme: "none",
    spec: {
      content: OpenApiSpecification,
    },
  })
);

export default app;
