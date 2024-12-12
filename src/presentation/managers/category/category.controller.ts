import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { CategoryService } from "../../services/category.service";
import { CreateCategoryDto } from "../../../domain/dtos/category/create-category.dto";
import { DeleteCategoryDto } from "../../../domain/dtos/category/delete-category.dto";
import { ModifyCategoryDto } from "../../../domain/dtos/category/modify-category.dto";



export class CategoryController {

    //DI
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.categoryService.createCategory(createCategoryDto!)
            .then(category => res.status(201).json(category))
            .catch(error => handleError(res, error));
    };

    getCategories = (req: Request, res: Response) => {
        this.categoryService.getCategories()
            .then(categories => res.json({ categories }))
            .catch(error => handleError(res, error));
    };

    getPopularCategories = (req: Request, res: Response) => {
        this.categoryService.getPopularCategories()
            .then(categories => res.json({ categories }))
            .catch(error => handleError(res, error));
    }

    modifyCategory = (req: Request, res: Response) => {

        const [error, modifyCategoryDto] = ModifyCategoryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.categoryService.modifyCategory(modifyCategoryDto!)
            .then(categories => res.json({ categories }))
            .catch(error => handleError(res, error));

    };

    deleteCategory = (req: Request, res: Response) => {

        const [error, deleteCategoryDto] = DeleteCategoryDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.categoryService.deleteCategory(deleteCategoryDto!)
            .then(() => res.sendStatus(204))
            .catch(error => handleError(res, error));

    };
}