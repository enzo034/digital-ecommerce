import { Document, Schema, model } from "mongoose";

interface Cart {
    user: string,
    packages: string[],
    totalPrice: number,
}

export type CartDocument = Document & Cart;

const cartSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    }],
    totalPrice: {
        type: Number,
        min: [0, 'Total price must be positive'],
    },
});

cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const CartModel = model<CartDocument>('Cart', cartSchema);