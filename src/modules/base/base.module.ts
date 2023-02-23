import { Module } from '@nestjs/common';
import {
  ProductsController,
  ProductsSchema,
} from '../../controllers/products/products.controller';
import {
  ManagersController,
  ManagersSchema,
} from '../../controllers/managers/managers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from '../../services/product/product.service';
import { ErrorService } from '../../services/error/error.service';
import { AuthModule } from '../auth/auth.module';
import { ManagersService } from '../../services/managers/managers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Products', schema: ProductsSchema },
      { name: 'Managers', schema: ManagersSchema },
    ]),
    AuthModule,
  ],
  controllers: [ProductsController, ManagersController],
  providers: [ProductService, ErrorService, ManagersService],
})
export class BaseModule {}
