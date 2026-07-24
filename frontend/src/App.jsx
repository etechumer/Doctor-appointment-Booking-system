import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import PatientPage from "./pages/patient/PatientPage";
import DoctorPage from "./pages/doctor/DoctorPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  AdminAppointmentDetails,
  AdminPersonDetails,
} from "./pages/admin/AdminDetails";
import CreateDoctors from "./pages/admin/CreateDoctors";
import PendingAppointments from "./pages/admin/PendingAppointments";
import RejectedAppointments from "./pages/admin/RejectedAppointments";
import BookedAppointments from "./pages/admin/BookedAppointments";
import AllPatients from "./pages/admin/AllPatients";
import AllDoctors from "./pages/admin/AllDoctors";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AppointmentsPending from "./pages/doctor/AppointmentsPending";
import AllBookedAppointments from "./pages/doctor/AllBookedAppointments";
import AllRejectedAppointments from "./pages/doctor/AllRejectedAppointments";
import UpdateDoctorPassword from "./pages/doctor/UpdateDoctorPassword";
import UpdatedoctorInfo from "./pages/doctor/UpdatedoctorInfo";
import DoctorAppointmentDetails from "./pages/doctor/DoctorAppointmentDetails";
import BookAppointments from "./pages/patient/BookAppointments";
import MyAppointments from "./pages/patient/MyAppointments";
import AppointmentDetails from "./pages/patient/AppointmentDetails";
import DoctorDetails from "./pages/patient/DoctorDetails";
import UpdatePatientPassword from "./pages/patient/UpdatePatientPassword";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-page" element={<AdminPage />}>
            <Route index element={<AdminDashboard />} />
            <Route path="create-doctors" element={<CreateDoctors />} />
            <Route
              path="pending-appointments"
              element={<PendingAppointments />}
            />
            <Route
              path="appointments/:category/:appointmentId"
              element={<AdminAppointmentDetails />}
            />
            <Route
              path="rejected-appointments"
              element={<RejectedAppointments />}
            />
            <Route
              path="booked-appointments"
              element={<BookedAppointments />}
            />
            <Route path="patients-all" element={<AllPatients />} />
            <Route path="patients/:personId" element={<AdminPersonDetails />} />
            <Route path="doctors-all" element={<AllDoctors />} />
            <Route path="doctors/:personId" element={<AdminPersonDetails />} />
          </Route>

          <Route path="/patient-page" element={<PatientPage />}>
            <Route index element={<BookAppointments />} />
            <Route path="my-appointments" element={<MyAppointments />} />
            <Route
              path="my-appointments/:appointmentId"
              element={<AppointmentDetails />}
            />
            <Route path="doctors/:doctorId" element={<DoctorDetails />} />
            <Route path="update-password" element={<UpdatePatientPassword />} />
          </Route>

          <Route path="/doctor-page" element={<DoctorPage />}>
            <Route index element={<DoctorDashboard />} />
            <Route
              path="appointments-pending"
              element={<AppointmentsPending />}
            />
            <Route
              path="appointments/:category/:appointmentId"
              element={<DoctorAppointmentDetails />}
            />
            <Route
              path="all-appointments-booked"
              element={<AllBookedAppointments />}
            />
            <Route
              path="all-appointments-rejected"
              element={<AllRejectedAppointments />}
            />
            <Route path="update-password" element={<UpdateDoctorPassword />} />
            <Route path="update-info" element={<UpdatedoctorInfo />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
