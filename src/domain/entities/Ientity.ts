import { Document } from "mongoose";

export interface IEntity<T> {
    // Método para convertir un objeto en una instancia del tipo T
    fromObject(object: { [key: string]: any }): T;
}

export function parseEntities<T>(EntityClass: IEntity<T>, documents: Document[]): T[] {
    return documents.reduce((acc: T[], document) => {
        try {
            const entity = EntityClass.fromObject(document);
            acc.push(entity); // Agrega solo los válidos
        } catch (error) {
            console.warn(`Error parsing document with ID ${document.id}:`);
        }
        return acc;
    }, []);
}