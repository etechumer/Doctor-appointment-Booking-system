import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Menu,
  X,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LandingPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/landing/get/all-doctors",
          {},
        );
        setDoctors(res.data.data);
      } catch (error) {
        console.error("Error Fetching Doctors", error);
        setMessage("Failed to load Doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <HeartPulse size={21} />
          </span>
          <span>VitaCare</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#care">Our care</a>
          <a href="#doctors">Doctors</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="header-actions">
          <Link className="text-link" to="/login">
            Log in
          </Link>
          <Link className="button button-small" to="/register">
            Register
          </Link>
        </div>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <div
        className={`mobile-menu-backdrop ${isMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
      />
      <aside
        className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-heading">
          <span className="brand-mark">
            <HeartPulse size={20} />
          </span>
          <span>Explore VitaCare</span>
        </div>
        <nav className="mobile-menu-links">
          <a href="#care" onClick={closeMenu}>Our care</a>
          <a href="#doctors" onClick={closeMenu}>Doctors</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
        </nav>
        <div className="mobile-menu-actions">
          <Link className="mobile-login-link" to="/login" onClick={closeMenu}>
            Log in
          </Link>
          <Link className="button" to="/register" onClick={closeMenu}>
            Register
          </Link>
        </div>
      </aside>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <span></span> Your health, thoughtfully managed
            </p>
            <h1>
              Exceptional care starts with a <em>better connection.</em>
            </h1>
            <p className="hero-description">
              Find the right clinician, request an appointment, and keep your
              care organised in one secure, simple place.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/register">
                Find a doctor <ArrowRight size={18} />
              </Link>
              <a className="button button-quiet" href="#how-it-works">
                How it works
              </a>
            </div>
            <div className="trust-row">
              <span>
                <ShieldCheck size={18} /> Secure & private
              </span>
              <span>
                <CalendarCheck size={18} /> Easy appointment requests
              </span>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="VitaCare doctor consultation illustration"
          >
            <div className="hero-glow"></div>
            <div className="doctor-portrait">
              <div className="portrait-initials">DR</div>
              <div className="coat"></div>
              <div className="stethoscope">◡</div>
            </div>
            <div className="appointment-card">
              <div className="mini-icon">
                <CalendarCheck size={20} />
              </div>
              <div>
                <small>Next available</small>
                <strong>Today, 2:30 PM</strong>
                <span>General consultation</span>
              </div>
            </div>
            <div className="rating-card">
              <span>★★★★★</span>
              <strong>Trusted care, made simple</strong>
            </div>
          </div>
        </section>

        <section className="role-strip" id="care">
          <p>One trusted platform for every part of care.</p>
          <div>
            <span>
              <Users size={19} /> Patients
            </span>
            <span>
              <Stethoscope size={19} /> Doctors
            </span>
            <span>
              <ShieldCheck size={19} /> Administrators
            </span>
          </div>
        </section>

        <section className="feature-section" id="how-it-works">
          <p className="eyebrow">
            <span></span> A calmer care experience
          </p>
          <h2>Everything you need to stay on top of your health.</h2>
          <div className="feature-grid">
            <article>
              <div className="feature-icon">
                <Stethoscope size={25} />
              </div>
              <h3>Find the right doctor</h3>
              <p>
                Browse qualified clinicians and choose the care that feels right
                for you.
              </p>
            </article>
            <article>
              <div className="feature-icon">
                <CalendarCheck size={25} />
              </div>
              <h3>Request with confidence</h3>
              <p>
                Send your appointment request in moments and track each update
                clearly.
              </p>
            </article>
            <article>
              <div className="feature-icon">
                <HeartPulse size={25} />
              </div>
              <h3>Care that stays connected</h3>
              <p>
                Your appointments and personal details are all kept in one
                protected place.
              </p>
            </article>
          </div>
        </section>

        <section className="doctors-section" id="doctors">
          <div>
            <p className="eyebrow">
              <span></span> Meet our specialists
            </p>
            <h2>
              Compassionate expertise,
              <br />
              close to home.
            </h2>
            <p>
              Our network brings together experienced professionals dedicated to
              helping you feel your best.
            </p>
            <Link className="inline-link" to="/register">
              Get started with VitaCare <ArrowRight size={17} />
            </Link>
          </div>
          <div className="doctor-list">
            {loading ? (
              <p>Loading doctors...</p>
            ) : doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <article className="doctor-card" key={doctor.doctorId}>
                  <div className={`doctor-avatar avatar-${index % 4}`}>
                    {doctor.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)}
                  </div>

                  <div>
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialization}</p>

                    <small>{doctor.qualification}</small>
                  </div>
                </article>
              ))
            ) : (
              <p>{message || "No doctors available."}</p>
            )}
            <Link className="inline-link" to="/register">
              View all doctors <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer>
        © 2026 VitaCare Health Management &nbsp; · &nbsp; Your wellbeing
        matters.
      </footer>
    </div>
  );
}
