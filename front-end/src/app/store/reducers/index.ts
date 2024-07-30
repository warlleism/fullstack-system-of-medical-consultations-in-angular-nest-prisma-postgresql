import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { conterReducer } from './counter.reducer';

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  counter: conterReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
