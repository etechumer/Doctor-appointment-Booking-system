import { AdminPeopleList } from "./AdminCardLists";
export default function AllDoctors() {
  return (
    <AdminPeopleList
      title="All doctors"
      type="doctors"
      endpoint="/doctors/all"
      dataKey="doctors"
    />
  );
}
