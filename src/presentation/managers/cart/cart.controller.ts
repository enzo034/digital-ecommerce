import { Request, Response } from "express";
import { ModifyCartDto } from "../../../domain/dtos/cart/add-item-to-cart.dto";
import { CartService } from "../../services/cart.service";
import { handleError } from "../../../config/handle-error";




export class CartController {

    constructor(
        public readonly cartService: CartService
    ) { }

    getCart = (req: Request, res: Response) => {
        
        this.cartService.getCart(req.body.user.id)
            .then(resp => res.status(201).json(resp))
            .catch(error => handleError(res, error));

    };

    addItemToCart = (req: Request, res: Response) => {
        const [error, modifyCartDto] = ModifyCartDto.create({ ...req.body, userId: req.body.user.id });
        if (error) return res.status(400).json({ error });

        this.cartService.addToCart(modifyCartDto!)
            .then(resp => res.status(201).json(resp))
            .catch(error => handleError(res, error));
    };

    deleteItemFromCart = (req: Request, res: Response) => {
        const [error, modifyCartDto] = ModifyCartDto.create({ ...req.body, userId: req.body.user.id });
        if (error) return res.status(400).json({ error });

        this.cartService.deleteItemFromCart(modifyCartDto!)
            .then(resp => res.status(201).json(resp))
            .catch(error => handleError(res, error));
    };

}