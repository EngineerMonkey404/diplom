import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateModel3DDto {
  @ApiProperty()
  html: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
