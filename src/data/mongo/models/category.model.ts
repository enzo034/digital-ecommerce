import {Schema, model, Document} from "mongoose";

interface Category {
    name: string,
}

export type CategoryDocument = Document & Category;

const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        lowercase: true,
        trim: true
    }

});

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const CategoryModel = model<CategoryDocument>('Category', categorySchema);