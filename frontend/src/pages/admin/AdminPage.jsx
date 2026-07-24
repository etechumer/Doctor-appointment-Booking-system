import React from "react";
import LogoutPage from "../auth/LogoutPage";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const linkBase = "portal-link";
const linkActive = "portal-link-active";
const AdminPage = () => {
  const location = useLocation();
  return (
    <>
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <div className="portal-head">
            <h2 className="font-bold">Admin Panel</h2>
            <LogoutPage />
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/admin-page"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/create-doctors"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Create Doctors
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/pending-appointments"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Pending Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/rejected-appointments"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Rejected Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/booked-appointments"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Booked Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/patients-all"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Patients
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-page/doctors-all"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Doctors
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="portal-main">
          <div key={location.pathname} className="portal-page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
