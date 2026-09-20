export const validateRegister = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Name, email and password are required",
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters",
    });
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain an uppercase letter",
    });
  }

  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain a lowercase letter",
    });
  }

  if (!/[0-9]/.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain a number",
    });
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain a special character",
    });
  }

  next();
};

export const validateLogin = (
  req,
  res,
  next
) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Email and password are required",
    });
  }

  next();
};