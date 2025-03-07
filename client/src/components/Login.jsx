import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const emailElement = useRef();
  const passwordElement = useRef();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailElement.current.value) {
      return;
    }

    if (!passwordElement.current.value) {
      return;
    }

    const email = emailElement.current.value;
    const password = passwordElement.current.value;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      navigate("/chats");

      emailElement.current.value = "";
      passwordElement.current.value = "";

      // alert("User logged in successfully");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        alert(error.response.data.message || "Error while logging in");
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("No response received from server");
      } else {
        console.error("Error message:", error.message);
        alert("Error while logging in");
      }
    }
  };

  const handleGuest = async () => {
    emailElement.current.value = "guest123@gmail.com";
    passwordElement.current.value = "1234";
  };

  return (
    <div>
      <h3 className="text-center">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            ref={emailElement}
            className="form-control"
            id="email"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            ref={passwordElement}
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Log In
        </button>
        <button
          type="button"
          onClick={handleGuest}
          className="btn btn-secondary w-100 mt-3"
        >
          Get guest user credentials
        </button>
      </form>
    </div>
  );
};

export default Login;
