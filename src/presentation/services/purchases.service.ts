import { PurchasesDocument, PurchasesModel } from "../../data/mongo/models/purchases.model";
import { PurchaseEntity } from "../../domain/entities/purchase.entity";
import { EcommerceQueryService } from "./ecommerce-query.service";
import { PackageOptions } from "./package.service";




export class PurchasesService {

    constructor(
        private readonly ecommerceQueryService: EcommerceQueryService
    ) { }

    async getPurchasesCommon(purchasesOptions: PackageOptions) {
        // Aquí pasamos `fetchPurchases` con el contexto correcto
        return await this.ecommerceQueryService.getResourcesCommon<PurchasesDocument>(PurchasesModel, PurchaseEntity, this.fetchPurchases.bind(this), purchasesOptions);
    }


    async fetchPurchases(where: any, page: number, limit: number, orderBy: any, isAdmin: boolean = false): Promise<PurchasesDocument[]> { // * No se devuelve una entidad ya que dentro de getPackagesCommon se parsean antes de ser devueltas desde fetch

        const purchases = await PurchasesModel.find(where || {}) //Lo único que va a cambiar va a ser que el admin va a traer todas las compras y el usuario solo las de él
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(orderBy);

        return purchases;
    }

}