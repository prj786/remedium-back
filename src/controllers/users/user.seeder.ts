import { DataFactory, Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../models/user.model';

export class UserSeeder implements Seeder {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserModel>,
  ) {}

  drop(): Promise<any> {
    return this.userModel.deleteMany({}) as any;
  }

  seed(): Promise<any> {
    const products = DataFactory.createForClass(this.userModel).generate(10);

    return this.userModel.insertMany(products);
  }
}
