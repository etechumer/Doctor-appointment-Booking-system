import { AdminAppointmentList } from "./AdminCardLists";
export default function BookedAppointments() {
  return (
    <AdminAppointmentList
      title="Booked appointments"
      category="booked"
      endpoint="/appointments/booked/all"
    />
  );
}
