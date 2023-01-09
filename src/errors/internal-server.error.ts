import { ApiProperty } from '@nestjs/swagger';
import { Error } from 'src/interfaces/error';

export class InternalServerError implements Error {
  constructor(message?: string) {
    message
      ? (this.message = message)
      : (this.message =
          'Ocorreu um erro no servidor. Por favor tente novamente ou entre em contato com o suporte.');
  }

  @ApiProperty({
    description: 'Success response',
    example: false,
  })
  _success: false;

  @ApiProperty({
    description: 'Error message. It goes into toast',
    example: false,
  })
  message: string;
}
