import { PurchasesDocument, PurchasesModel } from "../../data/mongo/models/purchases.model";
import { PurchaseEntity } from "../../domain/entities/purchase.entity";
import { EcommerceQueryService } from "./ecommerce-query.service";
import { PackageOptions } from "./package.service";




export class PurchasesService {

    constructor(
        private readonly ecommerceQueryService: EcommerceQueryService
    ) { }

    async getPurchasesCommon(packageOptions: PackageOptions) {
        // Aquí pasamos `fetchPurchases` con el contexto correcto
        return await this.ecommerceQueryService.getResourcesCommon<PurchasesDocument>(PurchasesModel, PurchaseEntity, this.fetchPurchases.bind(this), packageOptions);
    }


    async fetchPurchases(where: any, page: number, limit: number, orderBy: any, isAdmin: boolean = false): Promise<PurchasesDocument[]> {


        const purchases = await PurchasesModel.find(where || {}) //todo: si el rendimiento baja, hacer la páginación con cursores en lugar de usar .skip
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(orderBy);

        return purchases;
    }

}