import DoctorAppointmentList from "./DoctorAppointmentList";
export default function AllBookedAppointments() {
  return (
    <DoctorAppointmentList
      title="Booked appointments"
      subtitle="View your confirmed consultations."
      endpoint="/appointments/booked/all"
      category="booked"
    />
  );
}
