export interface WebhookInformation {
    type: string;
    uuid: string;
    order_id: string;
    amount: string;
    merchang_amount: string;
    commission: string;
    is_final: boolean;
    status: string;
    txid: string;
    currency: string;
    network: string;
    payer_currency: string;
    payer_amount: string;
    sign: string;
}

export class WebhookPaymentDto {
    private constructor(
        public readonly webhookInfo: WebhookInformation
    ) { }

    static create(object: { [key: string]: any }): [string?, WebhookPaymentDto?] {
        const requiredFields = [
            'type', 'uuid', 'order_id', 'amount', 'merchang_amount', 'commission',
            'is_final', 'status', 'txid', 'currency', 'network', 'payer_currency',
            'payer_amount', 'sign'
        ];

        for (const field of requiredFields) {
            if (!(field in object)) {
                return [`Missing field in webhookInfo: ${field}`];
            }
        }

        const webhookInfo: WebhookInformation = {
            type: object.type,
            uuid: object.uuid,
            order_id: object.order_id,
            amount: object.amount,
            merchang_amount: object.merchang_amount,
            commission: object.commission,
            is_final: object.is_final,
            status: object.status,
            txid: object.txid,
            currency: object.currency,
            network: object.network,
            payer_currency: object.payer_currency,
            payer_amount: object.payer_amount,
            sign: object.sign
        };

        return [undefined, new WebhookPaymentDto(webhookInfo)];
    }
}