import { Request, Response } from "express";
import { PaymentService } from "../../services/payment.service";
import { CreatePaymentDto } from "../../../domain/dtos/payment/create-payment.dto";
import { handleError } from "../../../config/handle-error";
import { WebhookPaymentDto } from "../../../domain/dtos/payment/webhook-payment.dto";




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

    paymentWebhook = (req: Request, res: Response) => {
        const [error, webhookPaymentDto] = WebhookPaymentDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.paymentService.paymentWebhook(webhookPaymentDto!)
            .then(resp => res.json({resp}))
            .catch(error => handleError(res, error));
    }

}