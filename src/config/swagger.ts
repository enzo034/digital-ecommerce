import express, { Application } from "express";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import path from "path";
import { envs } from "./envs";
import { fileURLToPath } from "url";


// Configuración básica de Swagger
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API para la gestión de una plataforma de comercio electrónico digital',
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production'
        ? 'https://www.naumowf.com/'
        : 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production'
        ? 'Servidor de Producción'
        : 'Servidor Local',
    },
  ],
  components: {
    schemas: {
      PackageFull: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '64f1e2dcb7a6c9c73f9e1234',
          },
          name: {
            type: 'string',
            example: 'Premium Package',
          },
          previewImage: {
            type: 'string',
            example: 'https://example.com/preview.jpg',
          },
          description: {
            type: 'string',
            example: 'This package includes exclusive features.',
          },
          price: {
            type: 'number',
            example: 29.99,
          },
          sourceFiles: {
            type: 'array',
            items: {
              type: 'string',
              example: 'SourceFile ID',
            },
          },
          categories: {
            type: 'array',
            items: {
              type: 'string',
              example: 'Category ID',
            },
          },
          timesSold: {
            type: 'integer',
            example: 100,
          },
        },
      },
      PackagePartial: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '64f1e2dcb7a6c9c73f9e1234',
          },
          name: {
            type: 'string',
            example: 'Premium Package',
          },
          previewImage: {
            type: 'string',
            example: 'https://example.com/preview.jpg',
          },
          description: {
            type: 'string',
            example: 'This package includes exclusive features.',
          },
          price: {
            type: 'number',
            example: 29.99,
          },
          timesSold: {
            type: 'integer',
            example: 100,
          },
          categories: {
            type: 'array',
            items: {
              type: 'string',
              example: 'Category ID',
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Invalid input',
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};



const routeExtension = envs.MY_APP_ENV === "production" ? "js" : "ts";

const routePath = path.resolve(
  process.cwd(),
  `dist/presentation/managers/**/*.routes.${routeExtension}`
);

// Opciones para swagger-jsdoc
const options: SwaggerOptions = {
  swaggerDefinition,
  apis: [
    routePath
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Application) => {
  const swaggerStaticPath = path.join(
    __dirname,
    "node_modules",
    "swagger-ui-dist"
  );

  app.use(
    "/api-docs",
    express.static(swaggerStaticPath, { index: false }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};
