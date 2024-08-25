import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import IDoctor from './doctor.entity';

@Injectable()
export class DoctorRepository {
  constructor(private prismaService: PrismaService) {}

  async getAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const doctors = await this.prismaService.doctor.findMany({
      skip,
      take,
    });

    const total = await this.prismaService.doctor.count();

    return {
      doctors: doctors,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getOneById(id: number) {
    return this.prismaService.doctor.findUnique({
      where: {
        id,
      },
    });
  }

  async getSearch(search: string) {
    const result = await this.prismaService.$queryRaw<IDoctor[]>`
    SELECT 
      d.id as doctor_id,
      d.name AS "name", 
      a.appointmentdate AS "date", 
      a.hour AS "hour"
    FROM "Doctor" d 
    LEFT JOIN "Appointment" a ON d.id = a.doctorid 
    LEFT JOIN "Patient" p ON a.patientid = p.id 
    WHERE d.speciality = ${search}
      `;

    return {
      doctors: result,
    };
  }

  async getAllSpeciality() {
    return this.prismaService.doctor.groupBy({
      by: ['speciality'],
      _count: true,
    });
  }

  async create(doctor: IDoctor) {
    return this.prismaService.doctor.create({
      data: doctor,
    });
  }

  async update(doctor: IDoctor) {
    return this.prismaService.doctor.update({
      where: {
        id: doctor.id,
      },
      data: doctor,
    });
  }

  async delete(id: number) {
    return this.prismaService.doctor.delete({
      where: {
        id,
      },
    });
  }
}
