import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateDetailsDocumentationDto } from './dto/CreateDetailsDocumentationDto';
import { DetailsDocumentationService } from './details-documentation.service';

@ApiTags('Документация к деталям')
@Controller('documentation')
export class DetailsDocumentationController {
  constructor(
    private readonly documentationService: DetailsDocumentationService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/:modelid/:detailid')
  getDocumentation(
    @Param('modelid', ParseIntPipe) modelId: number,
    @Param('detailid', ParseIntPipe) detailId: number,
  ) {
    return this.documentationService.getDocumentation(modelId, detailId);
  }

  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateDetailsDocumentationDto,
  })
  @Put('/:modelid/:detailid')
  updateCollection(
    @Param('modelid', ParseIntPipe) modelId: number,
    @Param('detailid', ParseIntPipe) detailId: number,
    @Body() newDocumentation: CreateDetailsDocumentationDto,
  ) {
    return this.documentationService.updateDocumentation(
      detailId,
      newDocumentation,
    );
  }

  @Delete('/:modelid/:detailid')
  deleteCollection(
    @Param('modelid', ParseIntPipe) modelId: number,
    @Param('detailid') detailId: string,
  ) {
    return this.documentationService.deleteDocumentation(detailId, modelId);
  }

  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateDetailsDocumentationDto,
  })
  @Post()
  createDocumentation(@Body() documentation: CreateDetailsDocumentationDto) {
    console.log(documentation);
    return this.documentationService.createDocumentation(documentation);
  }
}
