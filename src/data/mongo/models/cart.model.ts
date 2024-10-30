import { Schema, model } from "mongoose";


const cartSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    packages: [{
        packageId: {
            type: Schema.Types.ObjectId,
            ref: 'Package',
            required: true
        }
    }],
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'CHECKED_OUT'],
        default: 'ACTIVE'
    }

});

cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

export const CartModel = model('Cart', cartSchema);