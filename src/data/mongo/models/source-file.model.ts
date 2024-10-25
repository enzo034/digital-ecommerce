import {Schema, model} from "mongoose";


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


export const SourceFileModel = model('SourceFile', sourceFileSchema);