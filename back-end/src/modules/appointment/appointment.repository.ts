import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import IAppointment from './appointment.entity';
import * as fs from 'fs/promises';

@Injectable()
export class AppointmentRepository {
  constructor(private prismaService: PrismaService) {}

  async create(appointment: IAppointment) {
    const result = await this.prismaService.appointment.create({
      data: appointment,
    });
    return result;
  }

  async getAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const result = await this.prismaService.$queryRaw<IAppointment[]>`
        SELECT 
            a.id as id, 
            d.name AS "doctor", 
            d.id as "doctorid",
            p.name as "patient",
            p.id as "patientid",
            d.speciality AS "speciality", 
            a.appointmentdate AS "appointmentdate", 
            a.hour AS "hour", 
            p.name AS "patient", 
            p.gender AS "gender",
            a.description AS "description",
            r.id AS "resultid",
            r.resultpath AS "resultpath"
        FROM "Appointment" a 
        INNER JOIN "Doctor" d ON a.doctorid = d.id 
        INNER JOIN "Patient" p ON a.patientid = p.id
        LEFT JOIN "Result" r ON a.id = r.appointmentid
        LIMIT ${take} OFFSET ${skip}
        `;

    const appointments = await Promise.all(
      result.map(async (appointment) => {
        if (appointment.resultpath) {
          try {
            const fileBuffer = await fs.readFile(appointment.resultpath);
            appointment.resultpath = fileBuffer.toString('base64');
          } catch (error) {
            console.error(
              `Erro ao ler o arquivo em ${appointment.resultpath}:`,
              error,
            );
            appointment.resultpath = null;
          }
        }
        return appointment;
      }),
    );

    const total = await this.prismaService.appointment.count();

    return {
      appointments,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getOne(id: number) {
    const result = await this.prismaService.$queryRaw<IAppointment[]>`
        SELECT 
            a.id AS id, 
            d.name AS "Doctor", 
            d.speciality AS "Specialty", 
            a.appointmentdate AS "Appointment_Date", 
            p.name AS "Patient", 
            p.gender AS "Gender",
            a.description AS "Appointment_Description"
        FROM "Appointment" a 
        INNER JOIN "Doctor" d ON a.doctorid = d.id 
        INNER JOIN "Patient" p ON a.patientid = p.id 
        INNER JOIN "Result" r ON a.id = r.appointmentid
        where p.id = ${id};
    `;

    return result;
  }

  async update(appointment: IAppointment) {
    const { id } = appointment;

    await this.prismaService.appointment.update({
      where: { id },
      data: appointment,
    });

    const resultData = await this.prismaService.$queryRaw<IAppointment[]>`
        SELECT 
            a.id as id, 
            d.name AS "doctor", 
            d.id as "doctorid",
            p.name as "patient",
            p.id as "patientid",
            d.speciality AS "speciality", 
            a.appointmentdate AS "appointmentdate", 
            a.hour AS "hour", 
            p.gender AS "gender",
            a.description AS "description",
            r.id AS "resultid",
            r.resultpath AS "resultpath"
        FROM "Appointment" a 
        INNER JOIN "Doctor" d ON a.doctorid = d.id 
        INNER JOIN "Patient" p ON a.patientid = p.id
        LEFT JOIN "Result" r ON a.id = r.appointmentid
        WHERE a.id = ${id};
        `;

    const updatedAppointments = await Promise.all(
      resultData.map(async (appointment) => {
        if (appointment.resultpath) {
          try {
            const fileBuffer = await fs.readFile(appointment.resultpath);
            appointment.resultpath = fileBuffer.toString('base64');
          } catch (error) {
            console.error(
              `Erro ao ler o arquivo em ${appointment.resultpath}:`,
              error,
            );
            appointment.resultpath = null;
          }
        }
        return appointment;
      }),
    );

    return updatedAppointments;
  }

  async delete(id: number, appointmentId?: number) {
    try {
      if (appointmentId !== 0) {
        const resultResult = await this.prismaService.result.delete({
          where: {
            id: appointmentId,
          },
        });
      }

      const result = await this.prismaService.appointment.delete({
        where: {
          id,
        },
      });

      return result;
    } catch (error) {
      throw new Error('Erro ao deletar appointment ou result.');
    }
  }

  async deleteDoctorAppointments(id: number) {
    const result = await this.prismaService.appointment.deleteMany({
      where: {
        doctorid: id,
      },
    });

    return result;
  }
  async getAllMonthAppointments() {
    const result = await this.prismaService.$queryRaw<any[]>`
            WITH months AS (
            SELECT
                generate_series(
                    date_trunc('year', CURRENT_DATE), 
                    date_trunc('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 month', 
                    '1 month'
                ) AS month
        ),
        appointments AS (
            SELECT 
                date_trunc('month', "appointmentdate") AS month, 
                COUNT(*) AS appointment_count
            FROM "Appointment"
            WHERE "appointmentdate" >= date_trunc('year', CURRENT_DATE)
            AND "appointmentdate" < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
            GROUP BY month
        )
        SELECT 
            m.month,
            COALESCE(a.appointment_count, 0) AS appointment_count,
            (SELECT COUNT(*) FROM "Patient") AS total_patients,
            (SELECT COUNT(*) FROM "Doctor") AS total_doctors,
            (SELECT COUNT(*) FROM "Appointment") AS total_appointments
        FROM months m
        LEFT JOIN appointments a
        ON m.month = a.month
        ORDER BY m.month
        `;

    const flattenedArray = result.flatMap((item) => [
      item.appointment_count.toString(),
    ]);

    const values = result.map((item) => [
      item.total_patients.toString(),
      item.total_doctors.toString(),
      item.total_appointments.toString(),
    ]);

    return {
      appointmentsPerMonth: flattenedArray,
      result: values[0],
    };
  }
}
