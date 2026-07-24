import { AdminAppointmentList } from "./AdminCardLists";
export default function RejectedAppointments() {
  return (
    <AdminAppointmentList
      title="Rejected appointments"
      category="rejected"
      endpoint="/appointments/rejected/all"
    />
  );
}
