import React from "react";
import LogoutPage from "../auth/LogoutPage";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const linkBase = "portal-link";
const linkActive = "portal-link-active";
const DoctorPage = () => {
  const location = useLocation();
  return (
    <>
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <div className="portal-head">
            <h2 className="font-bold">Doctor Panel</h2>
            <LogoutPage />
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/doctor-page"
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
                  to="/doctor-page/appointments-pending"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Appointments Pending
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doctor-page/all-appointments-booked"
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
                  to="/doctor-page/all-appointments-rejected"
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
                  to="/doctor-page/update-password"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Update Password
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doctor-page/update-info"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Update Info
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

export default DoctorPage;
