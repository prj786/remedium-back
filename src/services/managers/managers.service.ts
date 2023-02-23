import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from '../../models/product.model';
import { PayloadModel } from '../../models/payload.model';
import { ManagerModel } from '../../models/manager.model';

@Injectable()
export class ManagersService {
  constructor(
    @InjectModel('Managers') private readonly managerModel: Model<ManagerModel>,
  ) {}
  async addManager(product: ManagerModel): Promise<any> {
    const newProduct = new this.managerModel(product);

    return await newProduct.save();
  }

  async getManagers(count: string): Promise<PayloadModel<ManagerModel[]>> {
    const managers = (await this.managerModel
      .find()
      .limit(parseInt(count, 10))
      .exec()) as ManagerModel[];
    const size = await this.managerModel.countDocuments({});

    return { items: managers, size: size } as PayloadModel<ManagerModel[]>;
  }
}
