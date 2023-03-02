import { DataFactory, Factory, Seeder } from 'nestjs-seeder';
import { InjectModel, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Model } from 'mongoose';
import { ProductModel } from '../../models/product.model';

@Schema()
class Product extends Document {
  @Factory((faker) => faker.word.noun())
  @Prop()
  productName: string;

  @Factory(() => Math.floor(Math.random() * 100))
  @Prop()
  quantity: number;

  @Factory(() => Math.floor(Math.random() * 100))
  @Prop()
  price: number;
}

export class ProductSeeder implements Seeder {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<ProductModel>,
  ) {}

  drop(): Promise<any> {
    return this.productModel.deleteMany({}) as any;
  }

  seed(): Promise<any> {
    const products = DataFactory.createForClass(Product).generate(100);

    return this.productModel.insertMany(products);
  }
}
