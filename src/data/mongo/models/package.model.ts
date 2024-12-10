import {Document, Schema, model} from "mongoose";

interface Package {
    name: string;
    previewImage: string;
    description: string;
    price: number;
    sourceFiles: string[]; // Referencias a ObjectIds de SourceFile
    categories: string[]; // Referencias a ObjectIds de Category
    timesSold: number;
    isActive: boolean;
}

export type PackageDocument = Document & Package;

const packageSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    previewImage: {
        type: String,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    sourceFiles: [{
        type: Schema.Types.ObjectId,
        ref: 'SourceFile'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    timesSold: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true,
    }

});

packageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const PackageModel = model<PackageDocument>('Package', packageSchema);