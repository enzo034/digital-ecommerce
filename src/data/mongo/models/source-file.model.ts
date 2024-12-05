import {Document, Schema, model} from "mongoose";

interface SourceFile {
    name: string,
    link: string
}

export type SourceFileDocument = Document & SourceFile;

const sourceFileSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    link: {
        type: String,
        required: [true, 'Link is required'],
        unique: true
    }

});

sourceFileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});


export const SourceFileModel = model<SourceFileDocument>('SourceFile', sourceFileSchema);