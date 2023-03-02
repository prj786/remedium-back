import * as mongoose from 'mongoose';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';
import { ProductModel } from '../../models/product.model';
import { ErrorService } from '../../services/error/error.service';
import { PayloadModel } from '../../models/payload.model';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../services/auth/auth.service';
import { IsOptional, IsString } from 'class-validator';

export class ProductsSearch {
  @IsOptional()
  @IsString()
  search?: string;
}

export const ProductsSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    unique: [true, 'Product is already added'],
  },
  price: { type: String, required: [true, 'Product price is required'] },
  quantity: {
    type: Number,
    required: [true, 'Product quantity can not be less than 1 and is required'],
  },
});
@Controller('api/products')
export class ProductsController {
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private errorService: ErrorService,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async addProduct(@Body() product: ProductModel) {
    try {
      return await this.productService.addProduct(product);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Put('/update/:productId')
  @UseGuards(AuthGuard('jwt'))
  async editProduct(@Body() product: ProductModel, @Param() param) {
    try {
      await this.productService.editProduct(product, param.productId);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Put('/sell/:productId')
  @UseGuards(AuthGuard('jwt'))
  async sellProduct(
    @Body()
    payload: {
      product: ProductModel;
      count: number;
      userId: string;
      newIncome: number;
    },
    @Param() param,
  ) {
    try {
      const updatedProduct = await this.productService.sellProduct(
        payload,
        param.productId,
      );

      if (updatedProduct) {
        return this.authService.updateSaleIncome(
          payload.userId,
          payload.newIncome,
        );
      }
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Get(':limit/:page')
  async getProducts(
    @Param() param: { limit: number; page: number },
    @Query() query: ProductsSearch,
  ): Promise<PayloadModel<ProductModel[]>> {
    try {
      return this.productService.getProducts(param, query);
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
