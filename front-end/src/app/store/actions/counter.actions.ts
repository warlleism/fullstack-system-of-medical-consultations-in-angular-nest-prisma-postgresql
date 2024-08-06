import { createAction, props } from "@ngrx/store";

export interface Doctor {
    id: number;
    name: string;
    speciality: string;
    cpf: string;
    gender: string;
    phone: string;
    birthdate: string;
  }
  

export const createDoctor = createAction('[Doctor] Create Doctor', props<{ doctor: Doctor }>());
export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');