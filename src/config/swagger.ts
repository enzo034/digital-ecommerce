import { Application } from "express";
import path from "path";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";

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
    {
      url: "https://www.naumowf.com/",
      description: "Servidor Produccion",
    },
  ],
};

// Opciones para swagger-jsdoc
const options: SwaggerOptions = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../presentation/managers/**/*.routes.ts'), // Usa `path.join` para rutas absolutas
  ],
  
};
console.log("Options: ");
console.log(options);
const swaggerSpec = swaggerJSDoc(options);
console.log("Spec: ");
console.log(swaggerSpec);
export default (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
