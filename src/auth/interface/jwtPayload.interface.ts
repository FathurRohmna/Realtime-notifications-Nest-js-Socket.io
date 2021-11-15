/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  refreshKey?: any;
}

export class JwtPayloadResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: any;
}
