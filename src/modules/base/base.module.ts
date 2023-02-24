import { Module } from '@nestjs/common';
import {
  ProductsController,
  ProductsSchema,
} from '../../controllers/products/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from '../../services/product/product.service';
import { ErrorService } from '../../services/error/error.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductsSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductService, ErrorService],
})
export class BaseModule {}
