export default interface IAppointment {
    id: number
    doctorid: number
    patientid: number
    description: string
    appointmentdate: Date | any
}