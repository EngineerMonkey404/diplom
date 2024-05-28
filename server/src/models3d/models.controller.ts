import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Post,
  Delete,
  Put,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Models3DService } from './models.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import LocalFilesInterceptor from 'src/interceptors/local-files.interceptor';
import { CreateModel3DDto } from './dto/CreateModel3DDto';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import LocalMultipleFilesInterceptor from 'src/interceptors/local-multiple-files.interceptor';

@ApiTags('Модели')
@Controller('models')
export class Models3DController {
  multerOptions: MulterOptions;
  constructor(
    private readonly models3DService: Models3DService,
    private readonly configService: ConfigService,
  ) {
    // this.multerOptions= {
    //   limits: {
    //     fieldSize: 52428800,
    //   },
    //   storage: diskStorage({
    //     destination: configService.get('STORAGE_PATH') + ,
    //     filename: (req, file, callback) => {
    //       callback(
    //         null,
    //         Buffer.from(file.originalname, 'latin1').toString('utf-8'),
    //       );
    //     },
    //   }),
    // };
  }

  @Get()
  getModels(@Query('search') search: string, @Query('page') page: number) {
    return this.models3DService.getModels(search, page);
  }

  // @Get('file/:id')
  // async downloadFileById(
  //   @Res({ passthrough: true }) res: Response,
  //   @Param('id') id: number,
  // ) {
  //   const file = await this.models3DService.getFileById(id);
  //   res.set('Content-Disposition', `attachment; filename="${file}"`);

  //   return new StreamableFile(
  //     createReadStream(
  //       join(process.cwd(), this.configService.get('MODELS3D_PATH'), file),
  //     ),
  //   );
  // }

  @Get(':id')
  getModel(@Param('id', ParseIntPipe) id: number) {
    return this.models3DService.getModel(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateModel3DDto,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalMultipleFilesInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      '/models3d',
    ),
  )
  @Put(':id')
  updateModel(
    @Body() body: { html: string },
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const file = files.file[0];
    const image = files.image[0];
    this.models3DService.updateModel({
      fileName: file.originalname,
      html: body.html,
      previewImageName: image.originalname,
      id,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateModel3DDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    LocalMultipleFilesInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      '/models3d',
    ),
  )
  addModel(
    @Body() body: { html: string },
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const file = files.file[0];
    const image = files.image[0];
    return this.models3DService.addModel(
      file.originalname,
      body.html,
      image.originalname,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteModel(@Param('id', ParseIntPipe) id: number) {
    this.models3DService.deleteModel(id);
  }
}
