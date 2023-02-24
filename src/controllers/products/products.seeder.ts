import { DataFactory, Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from '../../models/product.model';

export class ProductSeeder implements Seeder {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductModel>,
  ) {}

  drop(): Promise<any> {
    return this.productModel.deleteMany({}) as any;
  }

  seed(): Promise<any> {
    const products = DataFactory.createForClass(this.productModel).generate(
      100,
    );

    return this.productModel.insertMany(products);
  }
}
