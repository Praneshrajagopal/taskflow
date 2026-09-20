import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext";

import loginImage from "../../assets/taskflowlogin.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: location.state?.message || "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Please enter your password.";
    }

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      email: "",
      password: "",
      general: "",
    });

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      console.log("LOGIN EMAIL:", formData.email);

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("LOGIN SUCCESSFUL");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setErrors({
        email: "",
        password: "",
        general:
          error?.response?.data?.message ||
          "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.page}>

      <div className={styles.loginContainer}>


        <div className={styles.imageSection}>

          <img
            src={loginImage}
            alt="TaskFlow productivity illustration"
            className={styles.loginImage}
          />

        </div>


        <div className={styles.loginSection}>

          <div className={styles.card}>


            <h1 className={styles.logo}>
              Task<span>Flow</span>
            </h1>

            <h2>
              Welcome Back
            </h2>

            <p className={styles.subtitle}>
              Login to manage your tasks.
            </p>


            {errors.general && (
              <div className={styles.generalMessage}>
                {errors.general}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              noValidate
            >


              <div className={styles.formGroup}>

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={
                    errors.email
                      ? styles.inputError
                      : ""
                  }
                />

                {errors.email && (
                  <p className={styles.fieldError}>
                    {errors.email}
                  </p>
                )}

              </div>


              <div className={styles.formGroup}>

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={
                    errors.password
                      ? styles.inputError
                      : ""
                  }
                />

                {errors.password && (
                  <p className={styles.fieldError}>
                    {errors.password}
                  </p>
                )}

              </div>


              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>


            <div className={styles.divider}>

              <span></span>

              <p>OR</p>

              <span></span>

            </div>


            <p className={styles.switchText}>

              Don't have an account?

              <button
                type="button"
                className={styles.switchBtn}
                onClick={() =>
                  navigate("/signup")
                }
              >
                Create Account
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;