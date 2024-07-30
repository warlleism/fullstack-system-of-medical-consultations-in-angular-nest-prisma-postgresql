-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "appointmentid" INTEGER NOT NULL,
    "resultData" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_appointmentid_fkey" FOREIGN KEY ("appointmentid") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
