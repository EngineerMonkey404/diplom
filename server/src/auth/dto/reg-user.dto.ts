
import { ApiProperty } from '@nestjs/swagger';

export class RegUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
