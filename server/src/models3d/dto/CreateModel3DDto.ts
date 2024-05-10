import { ApiProperty } from '@nestjs/swagger';

export class CreateModel3DDto {
  @ApiProperty()
  html: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
