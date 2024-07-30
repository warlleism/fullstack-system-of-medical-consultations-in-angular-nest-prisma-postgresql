/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentdate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorid` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientid` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientname` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "appointmentDate",
DROP COLUMN "doctorId",
DROP COLUMN "patientId",
DROP COLUMN "patientName",
ADD COLUMN     "appointmentdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "doctorid" INTEGER NOT NULL,
ADD COLUMN     "patientid" INTEGER NOT NULL,
ADD COLUMN     "patientname" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorid_fkey" FOREIGN KEY ("doctorid") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
