import { isMongoId } from "../../../config/regular-exp";




export class CreatePaymentDto {

    private constructor(

        public readonly userId: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, CreatePaymentDto?] {

        const { userId } = object;

        if (!userId) return ['Missing userId'];
        if (!isMongoId(userId)) return ['user Id is not a valid id'];

        return [undefined, new CreatePaymentDto(userId)];

    }


}