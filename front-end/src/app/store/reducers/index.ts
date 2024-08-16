import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { doctorReducer } from './doctor.reducer';
import { patientReducer } from './patient.reducer';
import { appointmentReducer } from './appointment.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  doctor: doctorReducer,
  pageSize: doctorReducer,
  patient: patientReducer,
  appointment: appointmentReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
