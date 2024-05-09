import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';

function LocalFilesInterceptor(
  fieldName: string,
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

      this.fileInterceptor = new (FileInterceptor(fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
