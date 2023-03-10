import { seeder } from 'nestjs-seeder';
import { UserSeeder } from './controllers/users/user.seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './controllers/products/products.controller';
import { ProductSeeder } from './controllers/products/products.seeder';
import { UserSchema } from './controllers/users/users.controller';

seeder({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://prj786:Azerbaijanistheking@remedium-cluster.wsmtpoh.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'Products', schema: ProductsSchema },
      { name: 'Users', schema: UserSchema },
    ]),
  ],
}).run([UserSeeder, ProductSeeder]);
