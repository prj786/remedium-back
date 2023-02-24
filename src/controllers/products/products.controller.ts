import * as mongoose from 'mongoose';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';
import { ProductModel } from '../../models/product.model';
import { ErrorService } from '../../services/error/error.service';
import { PayloadModel } from '../../models/payload.model';
import { AuthGuard } from '@nestjs/passport';

export const ProductsSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    unique: [true, 'Product is already added'],
  },
  price: { type: String, required: [true, 'Product price is required'] },
  quantity: {
    type: Number,
    required: [true, 'Product quantity can not be less than 1 is required'],
  },
  saleDate: Date,
});
@Controller('api/products')
export class ProductsController {
  constructor(
    private productService: ProductService,
    private errorService: ErrorService,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async addProduct(@Body() product: ProductModel) {
    try {
      await this.productService.addProduct(product);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Post('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  async editProduct(@Body() product: ProductModel, @Param() param) {
    try {
      await this.productService.editProduct(product, param.id);
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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProduct(@Param() param): Promise<PayloadModel<ProductModel[]>> {
    try {
      return this.productService.deleteProduct(param.id);
    } catch (err) {
      this.errorService.returnResp(
        err,
        'Can not get products list, check connection',
      );
    }
  }
}
