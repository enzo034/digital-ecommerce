import { Document } from "mongoose";

export interface IEntity<T> {
    // Método para convertir un objeto en una instancia del tipo T
    fromObject(object: { [key: string]: any }): T;
}

export function parseEntities<T>(EntityClass: IEntity<T>, packageModel: Document[]): T[] {
    return packageModel.reduce((acc: T[], product) => {
        try {
            const entity = EntityClass.fromObject(product);
            acc.push(entity); // Agrega solo los válidos
        } catch (error) {
            console.warn(`Error parsing product with ID ${product.id}:`);
        }
        return acc;
    }, []);
}