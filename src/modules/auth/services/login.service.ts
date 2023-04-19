import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.entity';
import { BCryptProvider } from 'src/providers/encriptation/bcrypt.provider';
import { Repository } from 'typeorm';
import { LoginUserRespDTO } from '../dtos/resp/login-user.resp.dto';
import { LoginUserReqDTO } from '../dtos/req/login-user.req.dto';
import { Employee } from 'src/modules/employees/employee.entity';

@Injectable()
export class LoginService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Employee)
		private employeesRepository: Repository<Employee>,
		private jwtService: JwtService,
		private hashProvider: BCryptProvider,
	) {}

	async execute({
		email,
		password,
	}: LoginUserReqDTO): Promise<LoginUserRespDTO> {
		let user: User;
		let employee: Employee;
		try {
			user = await this.usersRepository.findOne({
				where: {
					email,
				},
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error fetching user from database',
				},
			);
		}

		if (!user) {
			try {
				employee = await this.employeesRepository.findOne({
					where: {
						email,
					},
				});
			} catch (e) {
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error fetching employee from database',
					},
				);
			}

			if (!employee) {
				throw new BadRequestException(
					'Email ou senha inválidos. Tente novamente.',
				);
			}

			let passwordValidated: boolean;
			try {
				passwordValidated = await this.hashProvider.compare({
					storedPassword: employee.password,
					typedPassword: password,
				});
			} catch (e) {
				console.log(e);
				throw new InternalServerErrorException(
					'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
					{
						description: 'Error comparing passwords',
					},
				);
			}

			if (!passwordValidated) {
				throw new BadRequestException(
					'Email ou senha inválidos. Tente novamente.',
				);
			}

			delete employee.password;

			const payload = {
				email: employee.email,
				sub: employee._eq,
			};

			const accessToken = this.jwtService.sign(payload);

			const loggedUser: LoginUserRespDTO = {
				employee,
				accessToken,
			};

			return loggedUser;
		}

		let passwordValidated: boolean;
		try {
			passwordValidated = await this.hashProvider.compare({
				storedPassword: user.password,
				typedPassword: password,
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ocorreu um erro interno no servidor. Por favor tente novamente ou contate o suporte.',
				{
					description: 'Error comparing passwords',
				},
			);
		}

		if (!passwordValidated) {
			throw new BadRequestException(
				'Email ou senha inválidos. Tente novamente.',
			);
		}

		delete user.password;

		const payload = {
			email: user.email,
			sub: user._eq,
		};

		const accessToken = this.jwtService.sign(payload);

		const loggedUser: LoginUserRespDTO = {
			user,
			accessToken,
		};

		return loggedUser;
	}
}
