import { createReducer, on } from "@ngrx/store";
import { createDoctor, deleteDoctor, getAllDoctors } from "../actions/counter.actions";
import { DoctorState } from "../../interfaces/IDoctos";

export const initialState: DoctorState = {
    doctors: [],
    pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
    }
};

export const doctorReducer = createReducer(
    initialState,
    on(getAllDoctors, (state, { doctors, pagination }) => ({
        doctors,
        pagination
    })
    ),
    on(createDoctor, (state, { doctor }) => ({
        ...state,
        doctors: [...state.doctors, doctor]
    })),
    on(deleteDoctor, (state, { id }) => ({
        ...state,
        doctors: state.doctors.filter(doctor => doctor.id !== id)
    }))
);
