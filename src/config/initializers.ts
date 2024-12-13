import { MongoDatabase } from "../data/mongo/mongo-database";
import { redis } from "../data/redis/redis";
import { envs } from "./envs";

export async function initializeServices() {
    try {
        // Inicializar MongoDB
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME,
        });

        // Redis ya está conectado al importarlo
        console.log("All services initialized successfully");
    } catch (error) {
        console.error("Error initializing services:", error);
        throw error;
    }
}

export async function shutdownServices() {
    try {
        // Desconectar servicios
        await MongoDatabase.disconnect();
        redis.quit(); // Cerrar conexión de Redis
        console.log("All services shut down successfully");
    } catch (error) {
        console.error("Error shutting down services:", error);
    }
}
