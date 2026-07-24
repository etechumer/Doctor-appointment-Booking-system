import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register/patient",
        {
          name,
          email,
          password,
          gender,
          age,
          phoneNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = res.data;

      if (data.message === "Patient registered Successfully") {
        setResponse(data.message);
        setSuccessMessage(data.message);
        setErrorMessage("");
        navigate("/login", { state: { successMessage: data.message } });
      } else if (data.message === "User Already exists") {
        setResponse(data.message);
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
      <div className="auth-page register-page">
        <Link className="auth-brand" to="/">
          <span>
            <HeartPulse size={20} />
          </span>{" "}
          VitaCare
        </Link>
        <div className="auth-layout">
          <section className="auth-intro">
            <p className="eyebrow">
              <span></span> Start your care journey
            </p>
            <h1>
              Health support, built around <em>you.</em>
            </h1>
            <p>
              Create your patient profile to find care and manage appointment
              requests with confidence.
            </p>
            <div className="auth-roles">
              <span>
                <ShieldCheck size={18} /> Private by design
              </span>
              <span>
                <Stethoscope size={18} /> Expert care network
              </span>
            </div>
          </section>
          <div className="auth-card">
            <form onSubmit={handleRegister}>
              <p className="auth-kicker">PATIENT REGISTRATION</p>
              <h2>Create your account</h2>
              <p className="auth-subtitle">
                A few details now, easier care later.
              </p>
              <div className="auth-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 border-gray-400 rounded"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
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
              <div className="auth-field">
                <label htmlFor="phoneNo">phoneNo</label>
                <input
                  type="text"
                  placeholder="Enter your phoneNo"
                  id="phoneNo"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  name="phoneNo"
                  className="border p-2 border-gray-400 rounded"
                />
              </div>
              <div className="auth-field">
                <div className="flex items-center space-x-4">
                  <label>Gender</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  id="age"
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border p-2 border-gray-400 rounded"
                />
              </div>
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
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Submitting" : "Submit"}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
