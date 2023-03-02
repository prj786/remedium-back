import { DataFactory, Factory, Seeder } from 'nestjs-seeder';
import { InjectModel, Prop, Schema } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserModel } from '../../models/user.model';
import * as bcrypt from 'bcrypt';

@Schema()
class User extends Document {
  @Factory((faker) => faker.word.noun() + Math.floor(Math.random() * 2))
  @Prop()
  username: string;

  @Factory((faker) => faker.name.firstName())
  @Prop()
  firstName: string;

  @Factory((faker) => faker.name.lastName())
  @Prop()
  lastName: string;

  @Factory(() => Math.floor(Math.random() * 100))
  @Prop()
  quantity: number;

  @Factory(() => 'password1234')
  @Prop()
  password: string;

  @Factory(() => 0)
  @Prop()
  saleIncome: number;

  @Factory(() => new Date())
  @Prop()
  registerDate: Date;
}

export class UserSeeder implements Seeder {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserModel>,
  ) {}

  drop(): Promise<any> {
    return this.userModel.deleteMany({}).then(() => {
      return bcrypt.hash('password1234', 10).then((res) => {
        return this.userModel.create({
          username: 'admin',
          firstName: 'manager',
          lastName: 'admin',
          password: res,
          registerDate: new Date(),
          saleIncome: 0,
        }) as any;
      });
    });
  }

  seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(10);

    return this.userModel.insertMany(users);
  }
}
