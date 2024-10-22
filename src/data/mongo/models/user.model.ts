import { model, Schema } from "mongoose";


const userSchema = new Schema({

    username: {
        type: String,
        required: [true, 'Name is required MDB']
    },
    email: {
        type: String,
        required: [true, 'Email is required MDB'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'Package'
    }]

});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.password;
    },
});

export const UserModel = model('User', userSchema);