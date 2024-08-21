
export interface Appointment {
  id: number;
  doctor: string;
  doctorid: number;
  patient: string;
  patientid: number;
  speciality: string;
  hour: string;
  appointmentdate: string;
  gender: string;
  description: string
  resultpath: string
}

export interface AppointmentState {
  appointments: Appointment[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}