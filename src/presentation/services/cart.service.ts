
import { CartModel, PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { AddToCartDto } from "../../domain/dtos/cart/add-item-to-cart.dto";



export class CartService {

    constructor() { }


    async getCart(userId: string) {
        const cart = await CartModel.findOne({ user: userId })
            .populate({
                path: 'packages.packageId', // Traer también los packages incluidos en el carrito
                select: 'name price description' 
            });
    
        if(!cart) throw CustomError.notFound('Cart not found');

        return cart;
    }
    


    async addToCart(addToCartDto: AddToCartDto) {
        const { userId, packageId } = addToCartDto;
        let response = {
            isNew: false, //Se retorna el cliente para saber si el package ya existia o no
            packageId: packageId, // Retorna el id del package
        };

        // Busca el paquete directamente para obtener su precio
        const packageData = await PackageModel.findById(packageId).select('price');
        if (!packageData) {
            throw CustomError.notFound('Package not found');
        }

        // Actualiza o crea el carrito en una sola operación
        const updateResult = await CartModel.findOne(
            { user: userId, "packages.packageId": packageId }
        );

        if (updateResult) {
            // Si el package ya existe, devuelve el resultado
            return response;
        }

        // Si el package no existía en el carrito, se agrega
        await CartModel.findOneAndUpdate(
            { user: userId },
            {
                $push: { packages: { packageId } },
                $inc: { totalPrice: packageData.price }
            },
            { upsert: true, new: true }
        );

        response.isNew = true;  // Marca el paquete como nuevo
        return response;

    }

}