import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorService {
  returnResp(err, msg = 'Internal Server Error, Check Object Validators') {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: msg,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: err,
      },
    );
  }
}
