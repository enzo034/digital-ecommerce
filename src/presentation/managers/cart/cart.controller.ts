import { Request, Response } from "express";
import { AddToCartDto } from "../../../domain/dtos/cart/add-item-to-cart.dto";
import { CartService } from "../../services/cart.service";
import { handleError } from "../../../config/handle-error";




export class CartController {

    constructor(
        public readonly cartService: CartService
    ) {}

    addItemToCart = (req: Request, res: Response) => {
        const [error, addToCartDto] = AddToCartDto.create({ ...req.body, userId: req.body.user.id});
        if (error) return res.status(400).json({ error });
    
        this.cartService.addToCart(addToCartDto!)
            .then(resp => res.status(201).json(resp))
            .catch(error => handleError(res, error));
    };

}