import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  let name = useRef();
  let email = useRef();
  let password = useRef();
  let confirmPassword = useRef();
  let refPic = useRef(null);

  const navigate = useNavigate();

  // State for error messages
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [show1, setShow1] = useState(false);
  const toggleVisibility1 = () => setShow1(!show1);

  const [show2, setShow2] = useState(false);
  const toggleVisibility2 = () => setShow2(!show2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    let hasError = false;

    if (!name.current.value) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Name is mandatory" }));
      hasError = true;
    }
    if (!email.current.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is mandatory",
      }));
      hasError = true;
    }
    if (!password.current.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is mandatory",
      }));
      hasError = true;
    }
    if (!confirmPassword.current.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm password",
      }));
      hasError = true;
    }
    if (password.current.value !== confirmPassword.current.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirmed password must be the same as Password",
      }));
      hasError = true;
    }

    if (hasError) {
      return; // Stop form submission if there are validation errors
    }

    const formData = new FormData();
    formData.append("name", name.current.value);
    formData.append("email", email.current.value);
    formData.append("password", password.current.value);
    formData.append("pic", refPic.current.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      // console.log(response?.data);

      navigate("/chats");

      // Clear form fields
      name.current.value = "";
      email.current.value = "";
      password.current.value = "";
      confirmPassword.current.value = "";
      refPic.current.value = "";

      alert("Registration successful");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Error while registering user");
      }
      console.log("Error while registering user", error);
    }
  };

  return (
    <div>
      <h3 className="text-center">Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter your name"
            ref={name}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            ref={email}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={show1 ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              ref={password}
            />
            <button type="button" onClick={toggleVisibility1}>
              {show1 ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-group">
            <input
              type={show2 ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              ref={confirmPassword}
            />
            <button type="button" onClick={toggleVisibility2}>
              {show2 ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="picture">Choose display picture</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="form-control"
            id="picture"
            ref={refPic}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
