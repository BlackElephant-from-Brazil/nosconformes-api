import { ApiProperty } from '@nestjs/swagger';
import { Error } from 'src/interfaces/error';

export class BadRequestError implements Error {
  @ApiProperty({
    description: 'Success response',
    example: false,
  })
  _success: false;

  @ApiProperty({
    description: 'Error message. It goes into toast',
    example: false,
  })
  message: 'A sua requisição é invalida, verifique os dados e tente novamente.';
}
