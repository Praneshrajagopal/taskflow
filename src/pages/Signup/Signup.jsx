import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one capital letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await register({
  name: formData.name,
  email: formData.email,
  password: formData.password,
});

navigate("/login", {
  replace: true,
  state: {
    message: "Account created successfully! Please login.",
    email: formData.email,
  },
});
    } catch (error) {
      console.error("Signup error:", error);

      setErrors({
        general:
          error?.response?.data?.message ||
          "Unable to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.logo}>TaskFlow</h1>

        <h2>Create Account</h2>

        <p className={styles.subtitle}>
          Create your account to manage your tasks.
        </p>

        <form onSubmit={handleSubmit}>

          {errors.general && (
            <p className={styles.generalError}>
              {errors.general}
            </p>
          )}

          <div className={styles.formGroup}>
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={
                errors.name ? styles.inputError : ""
              }
            />

            {errors.name && (
              <p className={styles.fieldError}>
                {errors.name}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={
                errors.email ? styles.inputError : ""
              }
            />

            {errors.email && (
              <p className={styles.fieldError}>
                {errors.email}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={
                errors.password ? styles.inputError : ""
              }
            />

            {errors.password && (
              <p className={styles.fieldError}>
                {errors.password}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                errors.confirmPassword
                  ? styles.inputError
                  : ""
              }
            />

            {errors.confirmPassword && (
              <p className={styles.fieldError}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.divider}>
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <p className={styles.switchText}>
          Already have an account?

          <button
            type="button"
            className={styles.switchBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;
