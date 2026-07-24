import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LockKeyhole, UserRound } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location?.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          userId,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = res.data;

      if (data.token) {
        setResponse(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.userId);
      }

      if (
        data.message === "Admin Login successful" &&
        data.user.role === "Admin"
      ) {
        console.log(data.message);
        navigate("/admin-page");
      } else if (
        data.message === "Login successful" &&
        data.user.role === "PATIENT"
      ) {
        console.log(data.message);
        navigate("/patient-page");
      } else if (
        data.message === "Login successful" &&
        data.user.role === "DOCTOR"
      ) {
        console.log(data.message);
        navigate("/doctor-page");
      }
    } catch (error) {
      console.error("Login Failed", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="auth-page">
        <Link className="auth-brand" to="/">
          <span>
            <HeartPulse size={20} />
          </span>{" "}
          VitaCare
        </Link>
        <div className="auth-layout">
          <section className="auth-intro">
            <p className="eyebrow">
              <span></span> Welcome back
            </p>
            <h1>
              Care is better when it feels <em>simple.</em>
            </h1>
            <p>
              Access your personalised health space and keep every appointment
              within reach.
            </p>
            <div className="auth-roles">
              <span>
                <UserRound size={18} /> Patient access
              </span>
              <span>
                <LockKeyhole size={18} /> Secure sign in
              </span>
            </div>
          </section>
          <div className="auth-card">
            <form onSubmit={handleLogin}>
              <p className="auth-kicker">YOUR ACCOUNT</p>
              <h2>Sign in to VitaCare</h2>
              <p className="auth-subtitle">
                Use your User ID and password to continue.
              </p>
              {successMessage && (
                <div className="mb-4 rounded-lg border border-green-500 bg-green-100 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-500 bg-red-100 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  placeholder="Enter your userId"
                  id="userId"
                  name="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="border p-2 border-gray-400 rounded"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className="border p-2 border-gray-400 rounded"
                />
              </div>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Submitting" : "Submit"}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                New to VitaCare?{" "}
                <Link to="/register">Create a patient account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
