import { Module } from '@nestjs/common';
import { BCryptProvider } from './bcrypt.provider';

@Module({
	providers: [BCryptProvider],
	exports: [BCryptProvider],
})
export class EncriptationModule {}
