/*
  Warnings:

  - A unique constraint covering the columns `[appointmentid]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Result_appointmentid_key" ON "Result"("appointmentid");
