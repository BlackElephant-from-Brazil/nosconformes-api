import { User } from 'src/modules/users/users.entity';

export type UpdateAuditorsReqDTO = {
	auditors: User[];
};
