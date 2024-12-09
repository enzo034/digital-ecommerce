import mongoose, { ClientSession } from "mongoose";
import { PaymentAdapter } from "../../config/payment.adapter";
import { CartDocument, CartModel, CategoryModel, PackageModel, UserModel } from "../../data/mongo";
import { OrderDocument, OrderModel } from "../../data/mongo/models/order.model";
import { PurchasesDocument, PurchasesModel } from "../../data/mongo/models/purchases.model";
import { CustomError } from "../../domain";
import { CreatePaymentDto } from "../../domain/dtos/payment/create-payment.dto";
import { PurchaseEntity } from "../../domain/entities/purchase.entity";
import { WebhookPaymentDto } from "../../domain/dtos/payment/webhook-payment.dto";


export class PaymentService {

    constructor() { }

    //#region Create Payment
    async createPayment(createPaymentDto: CreatePaymentDto): Promise<string> {

        const { userId } = createPaymentDto;

        const cart = await this.checkCartStatus(userId);

        const order = await this.createUserOrder(cart);

        const link = await PaymentAdapter.createPaymentLink(order.totalPrice!, order.id);

        return link;

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
        const session = await mongoose.startSession();
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

    //#endregion

    //#region Manage Cryptomus Webhook
    async paymentWebhook(payload: WebhookPaymentDto): Promise<{ message: string, purchase?: PurchaseEntity }> {
        if (payload.webhookInfo.type !== "payout") throw CustomError.badRequest(`Invalid webhook type: ${payload.webhookInfo.type}`);

        if (payload.webhookInfo.status !== 'paid') {
            this.manageWebhookStatus(payload.webhookInfo.status);
        }

        const purchase = await this.confirmPurchase(payload.webhookInfo.order_id);

        return { message: "Purchase created successfully", purchase: PurchaseEntity.fromObject(purchase) };
    }

    manageWebhookStatus(status: string): void {

        switch (status) {

            case 'process': throw CustomError.badRequest(`The status is in process.`);
            case 'check': throw CustomError.badRequest(`The status is in verification.`);
            case 'fail': throw CustomError.badRequest(`The payout has been failed. Contact support.`); //todo: si el pago is_final == true, simplemente cancelar, si es false, notificar al usuario con el id del payout para que contacte al soporte
            case 'cancel': throw CustomError.badRequest(`The payout has been canceled.`);
            case 'system_fail': throw CustomError.badRequest(`System error. Contact Support.`);

            default: throw CustomError.badRequest(`Status : ${status}, is not valid.`);

        }

    }

    async confirmPurchase(orderId: string): Promise<PurchasesDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await OrderModel.findById(orderId).session(session);
            if (!order) throw CustomError.notFound(`Order with id : ${orderId} not found.`);

            const purchase = await this.createPurchase(order, session);

            await this.updateTimesSold(order, session);

            await this.updateUserPackages(order, session);

            await session.commitTransaction();

            return purchase;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async createPurchase(order: OrderDocument, session: ClientSession): Promise<PurchasesDocument> {
        try {
            // Crear la instancia de compra
            const purchase = new PurchasesModel({
                userId: order.user,
                totalPrice: order.totalPrice,
                packages: order.packages,
            });

            // Guardar la compra dentro de la sesión de la transacción
            await purchase.save({ session });

            return purchase;
        } catch (error) {
            throw CustomError.internalServer(`Error creating purchase: ${error instanceof Error ? error.message : 'Internal server error.'}`);
        }
    }

    async updateTimesSold(order: OrderDocument, session: ClientSession): Promise<void> {

        const packageIds = order.packages;

        for (const pId of packageIds) {
            const newPackage = await PackageModel.findByIdAndUpdate(
                pId,
                { $inc: { timesSold: 1 } },
                { session, new: true },
            );

            await CategoryModel.updateMany({ id: newPackage?.categories },
                { $inc: { timesSold: 1 } },
                { session }
            );
        }
    }


    async updateUserPackages(order: OrderDocument, session: ClientSession) {
        try {
            // Actualizar los paquetes del usuario
            await UserModel.findByIdAndUpdate(
                order.user,
                { $push: { packages: { $each: order.packages } } }, // Usar $each para evitar conflictos con arrays
                { session }
            );
        } catch (error) {
            throw CustomError.internalServer(`Error updating user packages: ${error instanceof Error ? error.message : 'Internal server error.'}`);
        }
    }

    //#endregion

}