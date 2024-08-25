import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import IResult from "./Result.entity";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResultRepository {
    constructor(private prismaService: PrismaService) { }

    async create(result: IResult) {

        const createdResult = await this.prismaService.result.create({
            data: result,
        });

        const filePath = path.resolve(result.resultpath);

        try {

            const fileBuffer = await fs.promises.readFile(filePath);
            const base64Pdf = fileBuffer.toString('base64');

            return {
                ...createdResult,
                resultpath: base64Pdf,
            };
        } catch (error) {
            throw new Error(`Erro ao ler o arquivo PDF: ${error.message}`);
        }
    }

    async update(result: IResult) {

        const updateResult = await this.prismaService.result.update({
            where: {
                id: result.id
            },
            data: result
        })

        const filePath = path.resolve(result.resultpath);

        try {

            const fileBuffer = await fs.promises.readFile(filePath);
            const base64Pdf = fileBuffer.toString('base64');

            return {
                appointmentid: updateResult.appointmentid,
                resultid: updateResult.id,
                resultpath: base64Pdf,
            };
        } catch (error) {
            throw new Error(`Erro ao ler o arquivo PDF: ${error.message}`);
        }
    }

    async delete(id: number) {
        return this.prismaService.result.delete({
            where: {
                id
            }
        })
    }


}  