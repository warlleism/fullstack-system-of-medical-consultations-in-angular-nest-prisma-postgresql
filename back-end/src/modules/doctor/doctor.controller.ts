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
import { DoctorRepository } from './doctor.repository';
import IDoctor from './doctor.entity';
import ValidCPF from 'src/utils/validCPF';
import FormatData from 'src/utils/formatData';
import { AppointmentRepository } from '../appointment/appointment.repository';

@Controller('doctor')
export class DoctorController {
    constructor(private repo: DoctorRepository, private appointmentRepo: AppointmentRepository) { }

    @Post('create')
    async create(@Body() doctor: IDoctor) {
        try {

            if (Object.values(doctor).some(value =>
                (typeof value === 'string' && value.trim().length === 0) || value === null || value === undefined
            )) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'fields are required',
                }, HttpStatus.BAD_REQUEST);
            }

            const formattedDoctor = { ...doctor, cpf: ValidCPF(doctor.cpf), birthdate: FormatData(doctor.birthdate) };

            const newDoctor = await this.repo.create(formattedDoctor);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Doctor created successfully',
                data: newDoctor,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Doctor creation failed',
                error: error.message.includes('Unique constraint failed on the fields: (`cpf`)') ? 'Doctor already exists' : error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('update')
    async update(@Body() doctor: IDoctor) {
        try {

            if (Object.values(doctor).some(value =>
                (typeof value === 'string' && value.trim().length === 0) || value === null || value === undefined
            )) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'fields are required',
                }, HttpStatus.BAD_REQUEST);
            }

            const formattedDoctor = { ...doctor, cpf: ValidCPF(doctor.cpf), birthdate: FormatData(doctor.birthdate) };
            const updateddoctor = await this.repo.update(formattedDoctor);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Doctor updated successfully',
                data: updateddoctor,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Doctor update failed',
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        try {
            await this.appointmentRepo.deleteDoctorAppointments(+id);
            const doctor = await this.repo.delete(+id);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Doctor deleted successfully',
                data: doctor,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Doctor delete failed',
                error: error.message.includes('Record to delete does not exist') ? 'Doctor not found' : error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAll')
    async getAll(@Query('page') page: string = '1', @Query('pageSize') pageSize: string = '10') {
        try {
            const pageNumber = parseInt(page);
            const sizeNumber = parseInt(pageSize);

            if (isNaN(pageNumber) || isNaN(sizeNumber) || pageNumber <= 0 || sizeNumber <= 0) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid pagination parameters',
                    error: 'Page and pageSize must be positive integers',
                }, HttpStatus.BAD_REQUEST);
            }

            const doctorsData = await this.repo.getAll(pageNumber, sizeNumber);

            return {
                statusCode: HttpStatus.OK,
                message: 'Get All doctors successfully',
                data: {
                    doctors: doctorsData.doctors,
                    pagination: doctorsData.pagination,
                },
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Get All doctors failed',
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getOne/:id')
    async getOneById(@Param('id') id: string) {
        try {
            const doctor = await this.repo.getOneById(+id);
            return {
                statusCode: HttpStatus.CREATED,
                message: doctor == null ? 'Doctor not found' : 'Get One doctor successfully',
                data: doctor == null ? [] : doctor,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Get One doctor failed',
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

}
