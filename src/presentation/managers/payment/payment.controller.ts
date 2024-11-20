import { Request, Response } from "express";
import { PaymentService } from "../../services/payment.service";
import { CreatePaymentDto } from "../../../domain/dtos/payment/create-payment.dto";
import { handleError } from "../../../config/handle-error";




export class PaymentController {

    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    createPayment = (req: Request, res: Response) => {
        const [error, createPaymentDto] = CreatePaymentDto.create({ userId: req.body.user.id });
        if (error) return res.status(400).json({ error });

        this.paymentService.createPayment(createPaymentDto!)
            .then(resp => res.json({resp}))
            .catch(error => handleError(res, error));
    }

}