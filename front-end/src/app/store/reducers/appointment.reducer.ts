import { createReducer, on } from "@ngrx/store";
import { AppointmentState } from "../../interfaces/IAppointment";
import { createAppointment, deleteAppointment, getAllAppointments, updateAppointment } from "../actions/counter.actions";

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
    on(updateAppointment, (state, { appointment }) => ({
        ...state,
        appointments: state.appointments.map(d => {
            console.log(d.id === appointment.id ? appointment : d)
            return d.id === appointment.id ? appointment : d
        })
    })),
    on(deleteAppointment, (state, { id }) => ({
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== id)
    }))
);
