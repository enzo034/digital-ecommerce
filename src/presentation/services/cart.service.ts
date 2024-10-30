
import { CartModel, PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { AddToCartDto } from "../../domain/dtos/cart/add-item-to-cart.dto";



export class CartService {

    constructor() { }



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
        const updateResult = await CartModel.findOneAndUpdate(
            { user: userId, "packages.packageId": packageId },
            {
                // Si el package existe, incrementa la cantidad y el totalPrice del carrito
                $inc: { totalPrice: packageData.price }
            },
            { new: true }
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