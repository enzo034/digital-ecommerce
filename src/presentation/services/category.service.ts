import { CreateCategoryDto, CustomError, ModifyCategoryDto, DeleteCategoryDto } from "../../domain";
import { CategoryEntity } from "../../domain/entities/category.entity";





export class CategoryService {

    // DI
    constructor() { }


    async createCategory(createCategoryDto: CreateCategoryDto) {

        //todo:check if the category exists
        if (categoryExists) throw CustomError.badRequest('Category already exists');

        try {

            //todo: create the category

            return CategoryEntity.fromObject(category);

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async getCategories() {

        try {

            //todo get all categories
            return categories.map(category => CategoryEntity.fromObject(category)); // Se retornan las entidades de las categorias.

        } catch (error) {
            throw CustomError.internalServer("Internal server error");
        }

    }

    async modifyCategory(modifyCategoryDto: ModifyCategoryDto) {

        
        //todo: check if category exists
        if (!category) throw CustomError.notFound(`Category with id : ${modifyCategoryDto.categoryId} not found.`);

        try {

            //todo: update category

            return CategoryEntity.fromObject(modifiedCategory);

        } catch (error) {
            throw CustomError.internalServer("Internal server error");
        }

    }

    async deleteCategory(deleteCategoryDto: DeleteCategoryDto) {

        
        //todo: check if category exists
        if (!category) {
            throw CustomError.notFound(`Category with id: ${deleteCategoryDto.categoryId} not found.`);
        }

        try {
            //todo: delete category
        } catch (error) {
            throw CustomError.internalServer("Internal server error");
        }

    }

}