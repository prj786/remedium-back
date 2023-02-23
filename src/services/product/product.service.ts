import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from '../../models/product.model';
import { Model } from 'mongoose';
import { PayloadModel } from '../../models/payload.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductModel>,
  ) {}
  async addProduct(product: ProductModel): Promise<any> {
    const newProduct = new this.productModel(product);

    return await newProduct.save();
  }

  async getProducts(count: string): Promise<PayloadModel<ProductModel[]>> {
    const products = (await this.productModel
      .find()
      .limit(parseInt(count, 10))
      .exec()) as ProductModel[];
    const size = await this.productModel.countDocuments({});

    return { items: products, size: size } as PayloadModel<ProductModel[]>;
  }
}
