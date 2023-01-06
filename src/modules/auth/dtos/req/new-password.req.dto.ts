import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordReqDTO {
  @ApiProperty({
    description:
      'User email that is changing password. It should be a valid email.',
    example: 'gui.sartori96@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description:
      'New password. Password should have at least 1 uppercase character, 1 lowercase character, 1 number, 1 special character and the minimum is 8 characters.',
    example: 'Gu1lh3rm3#',
    required: true,
  })
  password: string;

  @ApiProperty({
    description: 'This field should be equal to "password" field.',
    example: 'Gu1lh3rm3#',
    required: true,
  })
  passwordConfirmation: string;

  @ApiProperty({
    description:
      'Protocol is the hash sent via email to user change his password.',
    example: 'nsau97y029ejo2neas6d5as9d210',
    required: true,
  })
  _protocol: string;
}
