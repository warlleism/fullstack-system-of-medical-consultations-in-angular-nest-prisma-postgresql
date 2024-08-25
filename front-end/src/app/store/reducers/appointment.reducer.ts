import { createReducer, on } from "@ngrx/store";
import { AppointmentState } from "../../interfaces/IAppointment";
import { createAppointment, createResult, deleteAppointment, deleteResult, getAllAppointments, updateAppointment, updateResult } from "../actions/counter.actions";

export const initialState: AppointmentState = {
    appointments: [],
    pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
    }
};

export const appointmentReducer = createReducer(
    initialState,
    on(getAllAppointments, (state, { appointments, pagination }) => ({
        appointments,
        pagination
    })
    ),
    on(createAppointment, (state, { appointment }) => ({
        ...state,
        appointments: [...state.appointments, appointment]
    })),
    on(createResult, (state, { result }) => ({
        ...state,
        appointments: state.appointments.map(appointment => {
            return appointment.id === result.appointmentid
                ? { ...appointment, resultid: result.id, resultpath: result.resultpath }
                : appointment;
        })
    })),

    on(updateResult, (state, { result }) => ({
        ...state,
        appointments: state.appointments.map(appointment =>
            appointment.resultid === result.resultid
                ? { ...appointment, resultpath: result.resultpath }
                : appointment
        )
    })),
    on(deleteResult, (state, { result }) => ({
        ...state,
        appointments: state.appointments.map(appointment =>
            appointment.resultid === result.id
                ? { ...appointment, resultpath: null, resultid: 0 }
                : appointment
        )
    })),
    on(updateAppointment, (state, { appointment }) => ({
        ...state,
        appointments: state.appointments.map(d => d.id === appointment.id ? appointment : d)
    })),
    on(deleteAppointment, (state, { id }) => ({
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== id)
    })),
);
