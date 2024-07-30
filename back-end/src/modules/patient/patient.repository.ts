import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import IPatient from "./patient.entity";

@Injectable()
export class PatientRepository {
    constructor(private prismaService: PrismaService) { }

    async getAll(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const patients = await this.prismaService.patient.findMany({
            skip,
            take,
        });

        const total = await this.prismaService.patient.count();

        return {
            patients: patients,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            }
        };


    }

    async getOneById(id: number) {
        return this.prismaService.patient.findUnique({
            where: {
                id
            }
        })
    }

    async create(patient: IPatient) {
        return this.prismaService.patient.create({
            data: patient
        })
    }

    async update(patient: IPatient) {
        return this.prismaService.patient.update({
            where: {
                id: patient.id
            },
            data: patient
        })
    }

    async delete(id: number) {
        return this.prismaService.patient.delete({
            where: {
                id
            }
        })
    }




}  