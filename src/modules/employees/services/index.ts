import { CreateEmployeeService } from './create-employee.service';
import { DeleteEmployeePhotoService } from './delete-employee-photo.service';
import { FindEmployeeByIdService } from './find-employee-by-id.service';
import { FindEmployeesService } from './find-employees.service';
import { UpdateEmployeePhotoService } from './update-employee-photo.service';
import { UpdateEmployeeService } from './update-employee.service';

export const employeesServices = [
	FindEmployeeByIdService,
	FindEmployeesService,
	CreateEmployeeService,
	UpdateEmployeeService,
	DeleteEmployeePhotoService,
	UpdateEmployeePhotoService,
];
