import React from "react";
import LogoutPage from "../auth/LogoutPage";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ChatAgentWidget from "./ChatAgentWidget";

const linkBase = "portal-link";
const linkActive = "portal-link-active";
const PatientPage = () => {
  const location = useLocation();
  return (
    <>
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <div className="portal-head">
            <h2 className="font-bold">Patient Panel</h2>
            <LogoutPage />
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/patient-page"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Book Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/patient-page/my-appointments"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  My Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/patient-page/update-password"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                  end
                >
                  Update Password
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="portal-main">
          <div key={location.pathname} className="portal-page-transition">
            <Outlet />
          </div>
          <ChatAgentWidget />
        </main>
      </div>
    </>
  );
};

export default PatientPage;
