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
import { UserRepository } from './user.repository';
import IUser from './user.entity';
import * as bcrypt from 'bcrypt';
import handleError from 'src/helpers/api-errors';

@Controller('user')
export class UserController {
    constructor(private repo: UserRepository) { }

    @Post('create')
    async create(@Body() user: IUser) {

        try {
            if (Object.values(user).some(value =>
                (typeof value === 'string' && value.trim().length === 0) || value === null || value === undefined
            )) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'fields are required',
                }, HttpStatus.BAD_REQUEST);
            }

            const hashPassword = await bcrypt.hash(user.password, 10)
            const formatedPassword = { ...user, password: hashPassword }
            const novoUsuario = await this.repo.create(formatedPassword);
            const { password, ...rest } = novoUsuario

            return {
                statusCode: HttpStatus.CREATED,
                message: 'User created successfully',
                data: rest,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'User creation failed',
                error: handleError('User', error)
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAll')
    async getAll(@Query('page') page: string = '1', @Query('pageSize') pageSize: string = '10') {
        try {
            const pageNumber = parseInt(page);
            const sizeNumber = parseInt(pageSize);

            const user = await this.repo.getAll(pageNumber, sizeNumber);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Get All Users successfully',
                data: user,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Get All Users failed',
                error: handleError('Users', error)
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('update')
    async update(@Body() user: IUser) {
        try {

            if (Object.values(user).some(value =>
                (typeof value === 'string' && value.trim().length === 0) || value === null || value === undefined
            )) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'fields are required',
                }, HttpStatus.BAD_REQUEST);
            }

            const updatedUser = await this.repo.update({ ...user });
            const { password, ...rest } = updatedUser
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User updated successfully',
                data: rest,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'User update failed',
                error: handleError('User', error)
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getOneById/:id')
    async getOneById(@Param('id') id: string) {

        try {
            const user = await this.repo.getOneById(+id);
            const { password, ...rest } = user
            return {
                statusCode: HttpStatus.CREATED,
                message: user == null ? 'User not found' : 'Get One User successfully',
                data: user == null ? [] : rest,
            };
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Get One User failed',
                error: handleError('User', error)
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {

        try {
            const user = await this.repo.delete(+id)
            const { password, ...rest } = user
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User deleted successfully',
                data: rest,
            };

        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'User creation failed',
                error: handleError('user', error),
            }, HttpStatus.BAD_REQUEST);
        }
    }
}