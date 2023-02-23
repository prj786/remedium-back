import * as mongoose from 'mongoose';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';
import { ProductModel } from '../../models/product.model';
import { ErrorService } from '../../services/error/error.service';
import { PayloadModel } from '../../models/payload.model';
import { AuthGuard } from '@nestjs/passport';

export const ProductsSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true },
  saleDate: Date,
});
@Controller('products')
export class ProductsController {
  constructor(
    private productService: ProductService,
    private errorService: ErrorService,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard())
  async addProduct(@Body() product: ProductModel) {
    try {
      await this.productService.addProduct(product);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Get(':count')
  async getProducts(@Param() param): Promise<PayloadModel<ProductModel[]>> {
    try {
      return this.productService.getProducts(param.count);
    } catch (err) {
      this.errorService.returnResp(
        err,
        'Can not get products list, check connection',
      );
    }
  }
}
