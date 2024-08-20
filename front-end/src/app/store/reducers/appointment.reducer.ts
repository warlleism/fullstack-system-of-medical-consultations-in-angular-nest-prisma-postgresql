import { createReducer, on } from "@ngrx/store";
import { AppointmentState } from "../../interfaces/IAppointment";
import { createAppointment, deleteAppointment, getAllAppointments, getMouthDashboardAppointment, updateAppointment } from "../actions/counter.actions";

export const initialState: AppointmentState = {
    appointments: [],
    appointmentsMonth: [],
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
        appointments: state.appointments.map(d => d.id === appointment.id ? appointment : d)
    })),
    on(deleteAppointment, (state, { id }) => ({
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== id)
    })),
    on(getMouthDashboardAppointment, (state, { appointment }) => ({
        ...state,
        appointmentsMonth: appointment
    }))
);
