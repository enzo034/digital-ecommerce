import { CategoryDocument, CategoryModel } from "../../data/mongo";
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

    async getPopularCategories() {
        const categories = await CategoryModel.find()
            .sort({ timesSold: -1 })
            .limit(6)
            .select('name timesSold');

        if (!categories.length) throw CustomError.notFound('No categories found.');
        
        return categories.map(category => CategoryEntity.fromObject(category));
    }

    async modifyCategory(modifyCategoryDto: ModifyCategoryDto) {

        const category = await this.checkIfCategoryExistsById(modifyCategoryDto.id);

        category.name = modifyCategoryDto.name!;

        await category.save();

        return CategoryEntity.fromObject(category);

    }

    async deleteCategory(deleteCategoryDto: DeleteCategoryDto) { //todo: verificar si se va a utilizar
        const category = await this.checkIfCategoryExistsById(deleteCategoryDto.id);
        await category.deleteOne();
    }

    async checkIfCategoryExistsById(categoryId: string): Promise<CategoryDocument> {
        const category = await CategoryModel.findById(categoryId);
        if (!category)
            throw CustomError.notFound(`Category with id: ${categoryId} not found.`);

        return category;
    }

}