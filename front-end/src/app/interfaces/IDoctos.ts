
export interface Doctor {
    id: number | string;
    name: string;
    speciality: string;
    cpf: string;
    gender: string;
    phone: string;
    birthdate: string;
}

export interface DoctorState {
    doctors: Doctor[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}