import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Models3DCollectionService } from './models3DCollection.service';
import { CreateModel3DCollectionDto } from './dto/CreateModel3DCollectionDto';
import { IModels3DCollection } from './types/collection.interface';

@ApiTags('Коллекции')
@Controller('collection')
export class Models3DCollectionController {
  constructor(
    private readonly models3DCollectionService: Models3DCollectionService,
    private readonly configService: ConfigService,
  ) {}
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateModel3DCollectionDto,
  })
  @Post()
  createCollection(@Body() collection: IModels3DCollection) {
    return this.models3DCollectionService.createCollection(collection);
  }

  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateModel3DCollectionDto,
  })
  @Put('/:id')
  updateCollection(
    @Param('id', ParseIntPipe) newCollectionId: number,
    @Body() newCollection: IModels3DCollection,
  ) {
    console.log('put');
    console.log(newCollection);
    return this.models3DCollectionService.updateCollection(
      newCollectionId,
      newCollection.title,
      newCollection.details,
    );
  }

  @Delete('/:id')
  deleteCollection(@Param('id', ParseIntPipe) id: number) {
    return this.models3DCollectionService.deleteCollection(id);
  }
}
