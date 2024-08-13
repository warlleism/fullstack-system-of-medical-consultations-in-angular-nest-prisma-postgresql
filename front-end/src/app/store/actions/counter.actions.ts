import { createAction, props } from "@ngrx/store";
import { Doctor } from "../../interfaces/IDoctos";
import { Patient } from "../../interfaces/IPatient";

export const getAllDoctors = createAction('[Doctor] Get All Doctors', props<{ doctors: Doctor[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }>());
export const createDoctor = createAction('[Doctor] Create Doctor', props<{ doctor: Doctor }>());
export const deleteDoctor = createAction('[Doctor] Delete Doctor', props<{ id: number | string }>());

export const getAllPatients = createAction('[Patient] Get All Patients', props<{ patients: Patient[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }>());
export const deletePatient = createAction('[Patient] Delete Patient', props<{ id: number | string }>());
export const createPatient = createAction('[Doctor]  Create Patient', props<{ patient: Patient }>());
