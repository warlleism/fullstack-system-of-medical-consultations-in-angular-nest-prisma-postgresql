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
import { AppointmentRepository } from './appointment.repository';
import IAppointment from './appointment.entity';
import FormatData from 'src/utils/formatData';

@Controller('appointment')
export class AppointmentController {
  constructor(private repo: AppointmentRepository) {}

  @Post('create')
  async create(@Body() appointment: IAppointment) {
    try {
      if (
        Object.values(appointment).some(
          (value) =>
            (typeof value === 'string' && value.trim().length === 0) ||
            value === null ||
            value === undefined,
        )
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'fields are required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const formattedAppointment = {
        ...appointment,
        appointmentdate: FormatData(appointment.appointmentdate),
      };
      const result = await this.repo.create(formattedAppointment);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create appointment successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Create appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('update')
  async update(@Body() appointment: IAppointment) {
    try {
      if (
        Object.values(appointment).some(
          (value) =>
            (typeof value === 'string' && value.trim().length === 0) ||
            value === null ||
            value === undefined,
        )
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'fields are required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const formattedAppointment = {
        ...appointment,
        appointmentdate: FormatData(appointment.appointmentdate),
      };
      const result = await this.repo.update(formattedAppointment);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create appointment successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Create appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getAll')
  async getAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    try {
      const pageNumber = parseInt(page);
      const sizeNumber = parseInt(pageSize);

      if (
        isNaN(pageNumber) ||
        isNaN(sizeNumber) ||
        pageNumber <= 0 ||
        sizeNumber <= 0
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid pagination parameters',
            error: 'Page and pageSize must be positive integers',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const appointment = await this.repo.getAll(pageNumber, sizeNumber);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Get All appointment successfully',
        data: appointment,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get All appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getOneById/:id')
  async getOne(@Param('id') id: number) {
    try {
      const appointment = await this.repo.getOne(+id);

      if (!appointment || Object.keys(appointment).length === 0) {
        throw new Error('Appointment not found');
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Get All appointment successfully',
        data: appointment,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get All appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete/:id/:appointmentid')
  async delete(
    @Param('id') id: number,
    @Param('appointmentid') appointmentid: number,
  ) {
    try {
      console.log(+id, +appointmentid);
      const result = await this.repo.delete(+id, +appointmentid);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Delete appointment successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Delete appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getAllMonthAppointments')
  async getAllMonthAppointments() {
    try {
      const result = await this.repo.getAllMonthAppointments();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Get All appointment successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Get All appointment failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
