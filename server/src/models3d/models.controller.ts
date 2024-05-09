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
} from '@nestjs/common';

import { Models3DService } from './models.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import LocalFilesInterceptor from 'src/interceptors/local-files.interceptor';
import { CreateCertificateModel3DDto } from './dto/CreateModel3DDto';
import { IModels3D } from './types/model3d.interface';

@ApiTags('Модели')
@Controller('models')
export class Models3DController {
  constructor(private readonly models3DService: Models3DService) {}

  @Get(':id')
  getModel(@Param('id', ParseIntPipe) id: number) {
    return this.models3DService.getModel(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateCertificateModel3DDto,
  })
  @UseInterceptors(LocalFilesInterceptor('file', '/models3d'))
  @Put(':id')
  updateModel(
    @Body() body: { html: string },
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.models3DService.updateModel(
      {
        fileName: file.originalname,
        html: body.html,
        id,
      },
      file,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateCertificateModel3DDto,
  })
  @Post()
  @UseInterceptors(LocalFilesInterceptor('file', '/models3d'))
  addModel(
    @Body() body: { html: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.models3DService.addModel(file.originalname, body.html);
  }

  @Delete(':id')
  deleteModel(@Param('id', ParseIntPipe) id: number) {
    this.models3DService.deleteModel(id);
  }
}
