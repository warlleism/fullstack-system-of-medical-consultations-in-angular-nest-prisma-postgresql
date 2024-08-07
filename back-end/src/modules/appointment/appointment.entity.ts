export default interface IAppointment {
    id: number
    hour: string
    doctorid: number
    patientid: number
    description: string
    appointmentdate: Date | any
}