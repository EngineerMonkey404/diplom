import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Models3DCollectionService } from './models3DCollection.service';
import { CreateModel3DCollectionDto } from './dto/CreateModel3DCollectionDto';
import { IModels3DCollection } from './types/collection.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @Post()
  createCollection(@Body() collection: IModels3DCollection) {
    return this.models3DCollectionService.createCollection(collection);
  }

  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateModel3DCollectionDto,
  })
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteCollection(@Param('id', ParseIntPipe) id: number) {
    return this.models3DCollectionService.deleteCollection(id);
  }
}
