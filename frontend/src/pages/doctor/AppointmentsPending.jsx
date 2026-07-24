import DoctorAppointmentList from "./DoctorAppointmentList";
export default function AppointmentsPending() {
  return (
    <DoctorAppointmentList
      title="Pending appointments"
      subtitle="Review incoming appointment requests."
      endpoint="/appointments/pending"
      category="pending"
    />
  );
}
