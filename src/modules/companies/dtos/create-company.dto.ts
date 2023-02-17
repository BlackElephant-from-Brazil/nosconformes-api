import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsUrl,
	MinLength,
	IsEmail,
	MaxLength,
	Length,
	Matches,
	ValidateNested,
	IsEmpty,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class Manager {
	@ApiProperty({
		description: 'The name of the manager',
		example: 'John Doe',
		required: true,
	})
	@IsNotEmpty({ message: 'O nome é obrigatório' })
	@IsString({ message: 'O nome deve ser um texto' })
	name: string;

	@ApiProperty({
		description: 'The email of the manager',
		example: 'johndoe@example.com',
		required: true,
	})
	@IsNotEmpty({ message: 'E-mail é obrigatório' })
	@IsEmail({}, { message: 'Formato de e-mail inválido' })
	email: string;

	@ApiProperty({
		description: 'The phone number of the manager',
		example: '11123451234',
		required: true,
	})
	@IsNotEmpty({ message: 'Número de telefone é obrigatório' })
	@Matches(/^\d+$/, { message: 'Número de telefone deve ser um número' })
	@MinLength(10, {
		message: 'Número de telefone deve ter pelo menos 10 dígitos',
	})
	@MaxLength(11, {
		message: 'Número de telefone deve ter no máximo 11 dígitos',
	})
	@IsString({
		message: 'Número de telefone deve ser do tipo texto com apenas números',
	})
	phone: string;

	@ApiProperty({
		description: 'The office of the manager',
		example: 'IT Manager',
		required: true,
	})
	@IsNotEmpty({ message: 'Cargo é obrigatório' })
	@IsString({ message: 'Cargo deve ser um texto' })
	office: string;

	@ApiProperty({
		description: 'The department of the manager',
		example: 'IT',
		required: true,
	})
	@IsNotEmpty({ message: 'Departamento é obrigatório' })
	@IsString({ message: 'Departamento deve ser um texto' })
	department: string;
}

class Company {
	@ApiProperty({
		description: 'The company logo URL',
		example: 'https://example.com/logo.png',
		required: true,
	})
	@IsNotEmpty({ message: 'URL do logo da empresa é obrigatório' })
	@IsString({ message: 'URL do logo da empresa deve ser um texto' })
	@IsUrl({}, { message: 'Formato de URL inválido' })
	logo: string;

	@ApiProperty({
		description: 'The name of the company',
		example: 'Acme Inc.',
		required: true,
	})
	@IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
	@IsString({ message: 'Nome da empresa deve ser um texto' })
	name: string;

	@ApiProperty({
		description: 'The CNPJ of the company',
		example: '10123123000112',
		required: true,
	})
	@IsNotEmpty({ message: 'CNPJ é obrigatório' })
	@IsString({ message: 'CNPJ deve ser do tipo texto com apenas números' })
	@Length(14, 14, { message: 'CNPJ deve ter 14 dígitos' })
	@Matches(/^\d+$/, { message: 'CNPJ deve ter apenas números' })
	cnpj: string;

	@ApiProperty({
		description: 'The website of the company',
		example: 'https://example.com',
		required: true,
	})
	@IsNotEmpty({ message: 'Site da empresa é obrigatório' })
	@IsUrl({}, { message: 'Formato de URL inválido' })
	site: string;
}

export class CreateCompanyDTO {
	@ApiProperty({
		description: 'The company information',
		example: {
			logo: 'https://example.com/logo.png',
			name: 'Acme Inc.',
			cnpj: '00000000000100',
			site: 'https://example.com',
		},
		required: true,
	})
	@IsNotEmpty({ message: 'Informações da empresa são obrigatórias' })
	@ValidateNested()
	@Type(() => Company)
	company: Company;

	@ApiProperty({
		description: 'The manager information',
		example: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			phone: '+55 11 99999-9999',
			office: 'São Paulo',
			department: 'IT',
		},
	})
	@ValidateNested()
	@Type(() => Manager)
	@IsOptional()
	manager?: Manager | object | null;
}
