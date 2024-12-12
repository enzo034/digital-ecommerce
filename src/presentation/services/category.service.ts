import { checkIfExistsById, isReferencedInModel } from "../../config/document-helper";
import { CategoryDocument, CategoryModel } from "../../data/mongo/models/category.model";
import { PackageModel } from "../../data/mongo/models/package.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { DeleteCategoryDto } from "../../domain/dtos/category/delete-category.dto";
import { ModifyCategoryDto } from "../../domain/dtos/category/modify-category.dto";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { CustomError } from "../../domain/errors/custom-error";





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

        const category = await checkIfExistsById<CategoryDocument>(CategoryModel, modifyCategoryDto.id);

        category.name = modifyCategoryDto.name!;

        await category.save();

        return CategoryEntity.fromObject(category);

    }

    async deleteCategory(deleteCategoryDto: DeleteCategoryDto) {

        const { id } = deleteCategoryDto;

        const category = await checkIfExistsById<CategoryDocument>(CategoryModel, id);

        const isCategoryReferenced = await isReferencedInModel(PackageModel, 'categories', id);

        if (isCategoryReferenced) throw CustomError.badRequest(`Can't delete category with id : ${id}. The document exists on a package.`)

        await category.deleteOne();
    }

}