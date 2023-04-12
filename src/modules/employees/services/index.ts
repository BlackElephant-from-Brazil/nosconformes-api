import { CreateEmployeeService } from './create-employee.service';
import { DeleteEmployeePhotoService } from './delete-employee-photo.service';
import { FindAvailableEmployeesToQuestionaryServcice } from './find-available-employees-to-questionary.servcice';
import { FindEmployeeByIdService } from './find-employee-by-id.service';
import { FindEmployeesInQuestionaryService } from './find-employees-in-questionary.service';
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
	FindAvailableEmployeesToQuestionaryServcice,
	FindEmployeesInQuestionaryService,
];
