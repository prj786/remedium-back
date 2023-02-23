import * as mongoose from 'mongoose';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';
import { ErrorService } from '../../services/error/error.service';
import { AuthGuard } from '@nestjs/passport';
import { ProductModel } from '../../models/product.model';
import { PayloadModel } from '../../models/payload.model';
import { ManagersService } from '../../services/managers/managers.service';
import { ManagerModel } from '../../models/manager.model';

export const ManagersSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  registerDate: { type: Date, required: true },
  salesIncome: Number,
});

@Controller('managers')
export class ManagersController {
  constructor(
    private managerService: ManagersService,
    private errorService: ErrorService,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard())
  async addProduct(@Body() manager: ManagerModel) {
    try {
      await this.managerService.addManager(manager);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Get(':count')
  async getProducts(@Param() param): Promise<PayloadModel<ManagerModel[]>> {
    try {
      return this.managerService.getManagers(param.count);
    } catch (err) {
      this.errorService.returnResp(
        err,
        'Can not get managers list, check connection',
      );
    }
  }
}
