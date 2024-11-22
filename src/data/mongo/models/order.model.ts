import { Schema, model, Document } from "mongoose";

interface Order {
    user: string,
    packages: string[],
    totalPrice: number,
    date: Date,
}

export type OrderDocument = Document & Order;

const orderSchema = new Schema({

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
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

});


orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const OrderModel = model<OrderDocument>('Order', orderSchema);