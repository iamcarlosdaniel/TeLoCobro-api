import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { apiReference } from "@scalar/express-api-reference";

import userAuthRoutes from "./v1/routes/userAuth.routes.js";
import usersRoutes from "./v1/routes/user.routes.js";

import clientsAuthRoutes from "./v1/routes/clientAuth.routes.js";
import clientsRoutes from "./v1/routes/client.routes.js";

import locationsRoutes from "./v1/routes/location.routes.js";
import companiesRoutes from "./v1/routes/company.routes.js";

import debtsRoutes from "./v1/routes/debt.routes.js";

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

//Rutas para manejar la atenticacion y manejo de los usuarios
app.use("/api/v1/auth/users", userAuthRoutes);
app.use("/api/v1/users", usersRoutes);

//Rutas para manejar la atenticacion y manejo de los clientes
app.use("/api/v1/auth/clients", clientsAuthRoutes);
app.use("/api/v1/clients", clientsRoutes);

app.use("/api/v1/location", locationsRoutes);
app.use("/api/v1/companies", companiesRoutes);
app.use("/api/v1/debts", debtsRoutes);

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
