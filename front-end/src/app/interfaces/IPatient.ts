
export interface Patient {
  id: number | string;
  name: string;
  cpf: string;
  gender: string;
  phone: string;
  birthdate: string;
}

export interface PatientState {
  patients: Patient[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}