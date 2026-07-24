import { AdminAppointmentList } from "./AdminCardLists";
export default function PendingAppointments() {
  return (
    <AdminAppointmentList
      title="Pending appointments"
      category="pending"
      endpoint="/appointments/pending/all"
    />
  );
}
