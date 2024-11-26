import { Schema, model, Document } from "mongoose";

interface Purchases {
    userId: string,
    packages: string,
    date: Date,
    totaPrice: number,
}

export type PurchasesDocument = Document & Purchases;

const purchasesSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserID is required'],
    },
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: [true, 'PackageID is required'],
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


export const PurchasesModel = model<PurchasesDocument>('Purchases', purchasesSchema);