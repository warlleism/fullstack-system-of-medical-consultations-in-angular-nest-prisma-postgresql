import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import IPatient from "./patient.entity";

@Injectable()
export class PatientRepository {
    constructor(private prismaService: PrismaService) { }

    async getAll(page?: number, pageSize?: number) {
        let patients;
        let total;

        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const take = pageSize;

            patients = await this.prismaService.patient.findMany({
                skip,
                take,
            });

            total = await this.prismaService.patient.count();
        } else {
            patients = await this.prismaService.patient.findMany();

            total = patients.length;
        }

        return {
            patients: patients,
            pagination: page && pageSize ? {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            } : undefined,
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

    async search(query: string) {
        return this.prismaService.patient.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'  
                }
            }
        });
    }



}  