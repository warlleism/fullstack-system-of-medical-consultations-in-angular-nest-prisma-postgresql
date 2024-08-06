import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { conterReducer } from './counter.reducer';
import { doctorReducer } from './doctor.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  counter: conterReducer,
  doctor: doctorReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
