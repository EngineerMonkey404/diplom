import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

function LocalMultipleFilesInterceptor(
  fieldsName: MulterField[],
  path = '',
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const multerOptions: MulterOptions = {
        limits: {
          fieldSize: 52428800,
        },
        storage: diskStorage({
          destination: configService.get('STORAGE_PATH') + path,
          filename: (req, file, callback) => {
            callback(
              null,
              Buffer.from(file.originalname, 'latin1').toString('utf-8'),
            );
          },
        }),
      };

      this.fileInterceptor = new (FileFieldsInterceptor(
        fieldsName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalMultipleFilesInterceptor;
