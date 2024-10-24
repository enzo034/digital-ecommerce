import { CategoryModel } from "../../data/mongo";
import { CreateCategoryDto, CustomError, ModifyCategoryDto, DeleteCategoryDto } from "../../domain";
import { CategoryEntity } from "../../domain/entities/category.entity";





export class CategoryService {

    // DI
    constructor() { }


    async createCategory(createCategoryDto: CreateCategoryDto) {

        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name })
        if (categoryExists) throw CustomError.badRequest('Category already exists');

        const category = await CategoryModel.create(createCategoryDto);

        return CategoryEntity.fromObject(category);

    }

    async getCategories() {

        const categories = await CategoryModel.find();
        if (!categories.length) throw CustomError.notFound('No categories found.');

        return categories.map(category => CategoryEntity.fromObject(category)); // Se retornan las entidades de las categorias.

    }

    async modifyCategory(modifyCategoryDto: ModifyCategoryDto) {

        const category = await CategoryModel.findById(modifyCategoryDto.categoryId);
        if (!category) throw CustomError.notFound(`Category with id : ${modifyCategoryDto.categoryId} not found.`);

        const modifiedCategory = await CategoryModel.findByIdAndUpdate(
            modifyCategoryDto.categoryId,
            { name: modifyCategoryDto.name },
            { new: true }
        );

        if (!modifiedCategory) throw CustomError.notFound(`Unable to update category with id: ${modifyCategoryDto.categoryId}`);

        return CategoryEntity.fromObject(modifiedCategory);

    }

    async deleteCategory(deleteCategoryDto: DeleteCategoryDto) {

        const category = await CategoryModel.findById(deleteCategoryDto.categoryId);
        if (!category) throw CustomError.notFound(`Category with id: ${deleteCategoryDto.categoryId} not found.`);

        await CategoryModel.deleteOne({ _id: deleteCategoryDto.categoryId });

    }

}