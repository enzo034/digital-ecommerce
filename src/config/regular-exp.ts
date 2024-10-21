import mongoose from "mongoose"




export const regularExps = {

    // email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,

}

export const isMongoId = (input: string): boolean => {
    return mongoose.Types.ObjectId.isValid(input);
}