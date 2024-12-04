import { Application } from "express";
import path from "path";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import { envs } from "./envs";

// Configuración básica de Swagger
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "API para la gestión de una plataforma de comercio electrónico digital",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
  ],
};

const routeExtension = envs.NODE_ENV === "production" ? "js" : "ts";
const routePath = path.join(__dirname, `../presentation/managers/**/*.routes.${routeExtension}`);


// Opciones para swagger-jsdoc
const options: SwaggerOptions = {
  swaggerDefinition,
  apis: [
    routePath
  ],

};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
