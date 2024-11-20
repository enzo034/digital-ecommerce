import crypto from 'crypto';

const API_KEY = ""; // falta solicitar, adaptar en .env y envs
const MERCHANT_ID = ""; // falta solicitar, adaptar en .env y envs

export class PaymentAdapter {

    static async createPaymentLink(price: number, cartId: string): Promise<string> {

        const link = `payment/${price}`; //De testeo hasta que se obtengan las credenciales

        const payload = {
            amount: price,
            currency: 'USD',
            order_id: cartId,
            url_success: '', //ruta del proyecto en caso de que el pago se haya hecho con éxito,
            url_return: '', //volver al sitio web inicial
            url_callback: '' // para la utilización de webhooks
        }

        const sign = crypto
            .createHash('md5')
            .update(Buffer.from(JSON.stringify(payload)).toString('base64') + API_KEY)
            .digest("hex");

        const response = await fetch('https://api.cryptomus.com/v1/payment', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                merchant: MERCHANT_ID,
                sign: sign
            }
        });

        const data = await response.json();

        if (!response.ok || !data.result || !data.result.url) {
            throw new Error(`Payment creation failed: ${data.message || 'Unknown error'}`);
        }

        return link; //data.result.url cuando se adapte api key y merchant id

    }

}