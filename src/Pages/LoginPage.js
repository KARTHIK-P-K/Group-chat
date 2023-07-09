import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
    console.log(credentials);
  };
  useEffect(() => {
    if (user) {
      console.log("it should go");
      navigate("/");
    }
  }, []);

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form
          onSubmit={(e) => {
            handleUserLogin(e, credentials);
          }}
        >
          <div className="field--wrapper">
            <label>Email:</label>
            <input
              type="email"
              required
              placeholder="Enter your email:"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <label>Password:</label>
            <input
              type="password"
              required
              placeholder="Enter password:"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="login"
            />
          </div>
        </form>
        <p>
          Don't have an account <Link to="/register">Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
