import { model, Schema } from "mongoose";



const transactionSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packages: [{
        packageId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    downloadLinks: [{
        type: String
    }]
});

export const TransactionModel = model('Transaction', transactionSchema)