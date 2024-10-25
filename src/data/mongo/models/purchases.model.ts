import { Schema, model } from "mongoose";


const purchasesSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserID is required'],
    },
    packages: [{
        package: {
            type: Schema.Types.ObjectId,
            ref: 'Package',
            required: [true, 'PackageID is required'],
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    totaPrice: {
        type: Number,
        required: [true, 'TotalPrice is required']
    }

});

purchasesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});


export const PurchasesModel = model('Purchases', purchasesSchema);