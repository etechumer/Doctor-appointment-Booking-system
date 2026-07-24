import { AdminPeopleList } from "./AdminCardLists";
export default function AllPatients() {
  return (
    <AdminPeopleList
      title="All patients"
      type="patients"
      endpoint="/patients/all"
      dataKey="patients"
    />
  );
}
