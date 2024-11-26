import {Schema, model} from "mongoose";


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
    }

});

packageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const PackageModel = model('Package', packageSchema);