import { createReducer, on } from "@ngrx/store";
import { createDoctor, Doctor } from "../actions/counter.actions";


export const initialState: Doctor[] = [];


export const doctorReducer = createReducer(
    initialState,
    on(createDoctor, (state, { doctor }) => [...state, doctor])
);
