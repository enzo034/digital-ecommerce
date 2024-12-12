import { Model } from "mongoose";
import { CustomError } from "../domain/errors/custom-error";



export async function isReferencedInModel(model: Model<any>, field: string, id: string): Promise<boolean> {
    const isReferenced = await model.exists({ [field]: id });
    return !!isReferenced;
}

export async function countDocuments<T>(model: Model<T>, where: Record<string, any>): Promise<number> {
    return await model.countDocuments(where);
}

export async function checkIfExistsById<T>(model: Model<T>, id: string): Promise<T> {
    const document = await model.findById(id);
    if (!document) {
        throw CustomError.notFound(`${model.modelName} with id: ${id} not found.`);
    }
    return document;
}
