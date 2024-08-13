import { createReducer, on } from "@ngrx/store";
import { PatientState } from "../../interfaces/IPatient";
import { createPatient, deletePatient, getAllPatients } from "../actions/counter.actions";

export const initialState: PatientState = {
    patients: [],
    pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
    }
};

export const patientReducer = createReducer(
    initialState,
    on(getAllPatients, (state, { patients, pagination }) => ({
        patients,
        pagination
    })
    ),
    on(createPatient, (state, { patient }) => ({
        ...state,
        patients: [...state.patients, patient]
    })),
    on(deletePatient, (state, { id }) => ({
        ...state,
        patients: state.patients.filter(patient => patient.id !== id)
    }))
);
