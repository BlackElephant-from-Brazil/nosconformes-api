import { ApiProperty } from '@nestjs/swagger';
import { Error } from 'src/interfaces/error';

export class BadRequestError implements Error {
  constructor(message?: string) {
    this._success = false;
    message
      ? (this.message = message)
      : (this.message =
          'A sua requisição é invalida, verifique os dados e tente novamente.');
  }

  @ApiProperty({
    description: 'Success response',
    example: false,
  })
  _success: boolean;

  @ApiProperty({
    description: 'Error message. It goes into toast',
    example: false,
  })
  message: string;
}
