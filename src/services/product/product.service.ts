import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from '../../models/product.model';
import { Model } from 'mongoose';
import { PayloadModel } from '../../models/payload.model';
import { ProductsSearch } from '../../controllers/products/products.controller';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductModel>,
  ) {}
  async addProduct(product: ProductModel): Promise<any> {
    const newProduct = new this.productModel(product);

    await newProduct.save();

    return newProduct;
  }

  async editProduct(product: ProductModel, productId: string): Promise<any> {
    return this.productModel
      .findByIdAndUpdate(productId, product)
      .setOptions({ overwrite: true });
  }

  async sellProduct(
    payload: {
      product: ProductModel;
      count: number;
      userId: string;
      newIncome: number;
    },
    productId: string,
  ): Promise<any> {
    const newProduct = {
      ...payload.product,
      quantity: payload.product.quantity - payload.count,
    };

    return this.productModel
      .findByIdAndUpdate(productId, newProduct)
      .setOptions({ overwrite: true });
  }

  async deleteProduct(productId: string): Promise<any> {
    return this.productModel.findByIdAndDelete(productId);
  }

  async getProducts(
    params: { limit: number; page: number },
    searchDto: ProductsSearch,
  ): Promise<PayloadModel<ProductModel[]>> {
    const query = {};

    if (searchDto.search) {
      query['productName'] = { $regex: new RegExp(searchDto.search, 'i') };
    }

    const products = (await this.productModel
      .find(query)
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .exec()) as ProductModel[];

    const size = await this.productModel.countDocuments(query).exec();

    return { items: products, size: size } as PayloadModel<ProductModel[]>;
  }
}
