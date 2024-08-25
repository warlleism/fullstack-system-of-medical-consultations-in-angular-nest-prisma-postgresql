import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import IPatient from './patient.entity';
import ValidCPF from 'src/utils/validCPF';
import FormatData from 'src/utils/formatData';

@Controller('patient')
export class PatientController {
  constructor(private repo: PatientRepository) {}

  @Post('create')
  async create(@Body() patient: IPatient) {
    try {
      if (!patient || Object.keys(patient).length === 0) {
        throw new Error('Data is required');
      }

      const formattedPatient = {
        ...patient,
        cpf: ValidCPF(patient.cpf),
        birthdate: FormatData(patient.birthdate),
      };
      const novoPaciente = await this.repo.create(formattedPatient);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Patient created successfully',
        data: novoPaciente,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Patient creation failed',
          error: error.message.includes(
            'Unique constraint failed on the fields: (`cpf`)',
          )
            ? 'Patient already exists'
            : error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('update')
  async update(@Body() patient: IPatient) {
    try {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

      if (!patient || Object.keys(patient).length === 0) {
        throw new Error('Data is required');
      }

      const cpf = patient.cpf.trim();

      if (!cpfRegex.test(cpf)) {
        throw new Error('Invalid CPF format');
      }

      const formattedPatient = {
        ...patient,
        cpf: ValidCPF(patient.cpf),
        birthdate: FormatData(patient.birthdate),
      };
      const updatedPatient = await this.repo.update(formattedPatient);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Patient updated successfully',
        data: updatedPatient,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Patient update failed',
          error: error.message.includes('Record to update not found.')
            ? 'Patient not exists'
            : error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      const patient = await this.repo.delete(+id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Patient deleted successfully',
        data: patient,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Patient creation failed',
          error: error.message.includes('Record to delete does not exist')
            ? 'Patient not found'
            : error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getAll')
  async getAll(@Query('page') page, @Query('pageSize') pageSize) {
    try {
      const pageNumber = parseInt(page);
      const sizeNumber = parseInt(pageSize);

      const patients = await this.repo.getAll(pageNumber, sizeNumber);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Get All Patients successfully',
        data: patients,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get All Patients failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getOneById/:id')
  async getOneById(@Param('id') id: string) {
    try {
      const patient = await this.repo.getOneById(+id);
      return {
        statusCode: HttpStatus.CREATED,
        message:
          patient == null
            ? 'Patient not found'
            : 'Get One Patient successfully',
        data: patient == null ? [] : patient,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get One Patient failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('search/:search')
  async getSearch(@Param('search') search: string) {
    try {
      if (search.length <= 2) {
        return;
      }

      const patient = await this.repo.search(search);
      return {
        statusCode: HttpStatus.CREATED,
        message:
          patient == null
            ? 'Patient not found'
            : 'Get One Patient successfully',
        data: patient == null ? [] : patient,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get One Patient failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
