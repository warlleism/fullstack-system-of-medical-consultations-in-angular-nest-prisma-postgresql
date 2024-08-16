import { createAction, props } from "@ngrx/store";
import { Doctor } from "../../interfaces/IDoctos";
import { Patient } from "../../interfaces/IPatient";
import { Appointment } from "../../interfaces/IAppointment";

export const getAllDoctors = createAction('[Doctor] Get All Doctors', props<{ doctors: Doctor[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }>());
export const createDoctor = createAction('[Doctor] Create Doctor', props<{ doctor: Doctor }>());
export const updateDoctor = createAction('[Doctor] Update Doctor', props<{ doctor: Doctor }>());
export const deleteDoctor = createAction('[Doctor] Delete Doctor', props<{ id: number | string }>());

export const getAllPatients = createAction('[Patient] Get All Patients', props<{ patients: Patient[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }>());
export const createPatient = createAction('[Doctor]  Create Patient', props<{ patient: Patient }>());
export const updatePatient = createAction('[Doctor] Update Doctor', props<{ patient: Patient }>());
export const deletePatient = createAction('[Patient] Delete Patient', props<{ id: number | string }>());

export const getAllAppointments = createAction('[Appointment] Get All Appointments', props<{ appointments: Appointment[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }>());
export const createAppointment = createAction('[Appointment] Create Appointment', props<{ appointment: Appointment }>());
export const updateAppointment = createAction('[Appointment] Update Appointment', props<{ appointment: Appointment }>());
export const deleteAppointment = createAction('[Appointment] Delete Doctor', props<{ id: number | string }>());
