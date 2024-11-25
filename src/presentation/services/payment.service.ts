import { PaymentAdapter } from "../../config/payment.adapter";
import { CartDocument, CartModel, UserModel } from "../../data/mongo";
import { OrderDocument, OrderModel } from "../../data/mongo/models/order.model";
import { PurchasesModel } from "../../data/mongo/models/purchases.model";
import { CustomError } from "../../domain";
import { CreatePaymentDto } from "../../domain/dtos/payment/create-payment.dto";

interface Order {
    user: string;
    packages: Array<string>;
    totalPrice: number;
    date: Date;
}

interface WebhookInformation {
    type: string,
    uuid: string,
    order_id: string,
    amount: string,
    merchang_amount: string,
    commission: string,
    is_final: boolean,
    status: string,
    txid: string,
    currency: string,
    network: string,
    payer_currency: string,
    payer_amount: string,
    sign: string
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

    async paymentWebhook(payload: WebhookInformation) {

        if (payload.type !== "payout") throw CustomError.badRequest("Invalid webhook type");

        if (payload.status !== 'paid') {
            this.manageWebhookStatus(payload.status);
            return { message: `Webhook processed with status: ${payload.status}` };
        }

        const order = await OrderModel.findById(payload.order_id);
        if (!order) throw CustomError.notFound(`Order with id : ${payload.order_id} not found.`);

        const purchases = await PurchasesModel.create({
            userId: order.user,
            totaPrice: order.totalPrice,
            packages: order.packages
        });

        // Agregar los packages al user
        await UserModel.findByIdAndUpdate(
            order.user,
            { $push: { packages: { $each: order.packages } } }, // Usar $each para evitar conflictos con arrays
        );

        // Retornar el resultado de la compra
        return { message: "Purchase created successfully", purchases };

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

    manageWebhookStatus(status: string) {

        switch (status) {

            case 'process': throw CustomError.badRequest(`The status is in process.`);
            case 'check': throw CustomError.badRequest(`The status is in verification.`);
            case 'fail': throw CustomError.badRequest(`The payout has been failed. Contact support.`); //todo: si el pago is_final == true, simplemente cancelar, si es false, notificar al usuario con el id del payout para que contacte al soporte
            case 'cancel': throw CustomError.badRequest(`The payout has been canceled.`);
            case 'system_fail': throw CustomError.badRequest(`System error. Contact Support.`);

            default: throw CustomError.badRequest(`Status : ${status}, is not valid.`);

        }

    }
}