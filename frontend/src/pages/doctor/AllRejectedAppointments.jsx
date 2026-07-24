import DoctorAppointmentList from "./DoctorAppointmentList";
export default function AllRejectedAppointments() {
  return (
    <DoctorAppointmentList
      title="Rejected appointments"
      subtitle="View appointment requests that were declined."
      endpoint="/appointments/reject/all"
      category="rejected"
    />
  );
}
