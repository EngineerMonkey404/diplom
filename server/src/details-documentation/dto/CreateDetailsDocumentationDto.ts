import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailsDocumentationDto {
  @ApiProperty()
  detailId: string;
  @ApiProperty()
  documentation: string;
  @ApiProperty()
  modelId: number;
}
