import { PaymentAdapter } from "../../config/payment.adapter";
import { CartModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CreatePaymentDto } from "../../domain/dtos/payment/create-payment.dto";



export class PaymentService {

    constructor() { }

    async createPayment(createPaymentDto: CreatePaymentDto) {

        const { userId } = createPaymentDto;

        const cart = await CartModel.findOne({ user: userId })
        
        if(!cart || cart.packages.length === 0) 
            throw CustomError.badRequest("The cart is empty");

        if (!cart.totalPrice || cart.totalPrice <= 0) 
            throw CustomError.badRequest("Invalid cart total price");

        const link = await PaymentAdapter.createPaymentLink(cart.totalPrice!, cart.id);

        return link;

    }
    

}