
import { CartModel, PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { ModifyCartDto } from "../../domain/dtos/cart/add-item-to-cart.dto";
import { CartEntity } from "../../domain/entities/cart.entity";



export class CartService {

    constructor() { }


    async getCart(userId: string): Promise<CartEntity> {

        const cart = await CartModel.findOne({ user: userId })
            .populate({
                path: 'packages', // Traer también los packages incluidos en el carrito
                select: 'name price description'
            });
        if (!cart) throw CustomError.notFound('Cart not found');

        return CartEntity.fromObject(cart);
    }

    async addToCart(modifyCartDto: ModifyCartDto): Promise<Record<string, any>> {

        const { userId, packageId } = modifyCartDto;
        let response = {
            isNew: false, //Se retorna el cliente para saber si el package ya existia o no
            packageId: packageId, // Retorna el id del package
        };

        const updateResult = await CartModel.findOne({ user: userId, packages: packageId });
        if (updateResult) return response; // Si el package ya existe, devuelve el resultado

        // Busca el paquete directamente para obtener su precio
        const packageData = await PackageModel.findById(packageId).select('price');
        if (!packageData) throw CustomError.notFound('Package not found');

        // Si el package no existía en el carrito, se agrega
        await CartModel.findOneAndUpdate(
            { user: userId },
            {
                $push: { packages: packageId },
                $inc: { totalPrice: packageData.price }
            },
            { upsert: true, new: true }
        );

        response.isNew = true;

        return response;

    }

    async deleteItemFromCart(modifyCartDto: ModifyCartDto) {
        const { userId, packageId } = modifyCartDto;

        // Busca el cart
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) throw CustomError.notFound('Cart not found');

        // Verificar si el paquete está en el carrito
        if (!cart.packages.includes(packageId)) {
            throw CustomError.notFound('Package not found in cart');
        }

        // Busca el package
        const packageData = await PackageModel.findById(packageId).select('price');
        if (!packageData) {
            // Si el paquete no existe en la base de datos, eliminarlo del carrito
            await CartModel.findOneAndUpdate(
                { user: userId },
                {
                    $pull: { packages: packageId },
                }
            );
            return { message: 'Package not found in the database, removed from cart' };
        }

        // Elimina el package y ajusta el totalPrice
        const updatedCart = await CartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: { packages: packageId },
                $inc: { totalPrice: -packageData.price }
            },
            { new: true }
        );

        if (!updatedCart) throw CustomError.internalServer('Internal server error, can not update the cart.');

        return CartEntity.fromObject(updatedCart);
    }



}