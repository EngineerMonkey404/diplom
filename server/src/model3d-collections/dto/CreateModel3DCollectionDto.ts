import { ApiProperty } from '@nestjs/swagger';

export class CreateModel3DCollectionDto {
  @ApiProperty()
  modelId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  details: string[];
}
