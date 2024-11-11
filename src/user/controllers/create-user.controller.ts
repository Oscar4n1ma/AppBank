import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserClientService } from '../services/create-client.service';
import { CreateUserClientDto } from '../dto/user-client.dto';
import { ErrorHandler } from 'src/utils/error-handler';
import { CreateUserEnterpriseService } from '../services/create-enterprise.service';
import { CreateUserEnterprisetDto } from '../dto/user-enterprise.dto';
import { CreateUserEmployeeService } from '../services/create-employee.service';
import { CreateUserEmployeeDto } from '../dto/user-employee.dto';

@Controller('user')
export class CreateUserController {
  constructor(
    private readonly createUserClientService: CreateUserClientService,
    private readonly createUserEnterpriseService: CreateUserEnterpriseService,
    private readonly createUserEmployee: CreateUserEmployeeService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post('client')
  async createClient(@Body() userData: CreateUserClientDto) {
    try {
      const userId = await this.createUserClientService.use(
        userData as CreateUserClientDto,
      );

      return {
        error: false,
        msg: null,
        data: {
          userId,
        },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }

  @Post('enterprise')
  async createEnterprise(@Body() userData: CreateUserEnterprisetDto) {
    try {
      const userId = await this.createUserEnterpriseService.use(userData);
      return {
        error: false,
        msg: null,
        data: {
          userId,
        },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }

  @Post('employee')
  async createEmployee(@Body() userData: CreateUserEmployeeDto) {
    try {
      const userId = await this.createUserEmployee.use(userData);
      return {
        error: false,
        msg: null,
        data: {
          userId,
        },
      };
    } catch (error) {
      this.errorHandler.use(error);
    }
  }
}
