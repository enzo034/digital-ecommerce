import { PaymentAdapter } from "../../config/payment.adapter";
import { CartDocument, CartModel } from "../../data/mongo";
import { OrderDocument, OrderModel } from "../../data/mongo/models/order.model";
import { CustomError } from "../../domain";
import { CreatePaymentDto } from "../../domain/dtos/payment/create-payment.dto";

interface Order {
    user: string;
    packages: Array<string>;
    totalPrice: number;
    date: Date;
}


export class PaymentService {

    constructor() { }

    async createPayment(createPaymentDto: CreatePaymentDto) {

        const { userId } = createPaymentDto;

        const cart = await this.checkCartStatus(userId);

        const order = await this.createUserOrder(cart);

        const link = await PaymentAdapter.createPaymentLink(order.totalPrice!, order.id);

        return link;

    }

    async paymentWebhook(orderId: string) {

        //todo

    }

    async checkCartStatus(userId: string) {
        const cart = await CartModel.findOne({ user: userId })

        if (!cart || cart.packages.length === 0)
            throw CustomError.badRequest("The cart is empty");

        if (!cart.totalPrice || cart.totalPrice <= 0)
            throw CustomError.badRequest("Invalid cart total price");

        return cart;
    }

    async createUserOrder(cart: CartDocument): Promise<OrderDocument> {
        const session = await CartModel.startSession();
        session.startTransaction();

        try {
            const order = await OrderModel.create(

                {
                    user: cart.user,
                    packages: cart.packages,
                    totalPrice: cart.totalPrice,
                    date: Date.now(),
                }
            );
            await order.save({ session });
            
            await cart.updateOne(
                { packages: [], totalPrice: 0 },
                { session }
            );

            await session.commitTransaction();
            return order;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}