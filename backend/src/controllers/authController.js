const {
  signupUser,
  loginUser,
  updateProfile,
} = require("../services/authService");

/* ---------------- Signup ---------------- */

async function signup(req, res) {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Name, email and password are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message:
          "Password must be at least 8 characters",
      });
    }

    const user =
      await signupUser(
        name,
        email,
        password
      );

    res.status(201).json({
      status: "success",
      message:
        "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    if (
      error.message ===
      "Email already registered"
    ) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message:
        "Something went wrong",
    });
  }
}

/* ---------------- Login ---------------- */

async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message:
          "Email and password are required",
      });
    }

    const result =
      await loginUser(
        email,
        password
      );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    if (
      error.message ===
      "Invalid email or password"
    ) {
      return res.status(401).json({
        status: "error",
        message:
          "Invalid email or password",
      });
    }

    res.status(500).json({
      status: "error",
      message:
        "Something went wrong",
    });
  }
}

/* ---------------- Get Current User ---------------- */

function getMe(req, res) {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
}

/* ---------------- Update Profile ---------------- */

async function updateProfileController(
  req,
  res
) {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    /*
     * Validate username.
     */
    if (name !== undefined) {
      if (
        !name ||
        !name.trim()
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Name cannot be empty",
        });
      }
    }

    /*
     * Validate email.
     */
    if (email !== undefined) {
      if (
        !email ||
        !email.includes("@")
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "Please provide a valid email",
        });
      }
    }

    /*
     * Validate password change.
     */
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          status: "error",
          message:
            "Current password is required to change your password",
        });
      }

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "New password must be at least 8 characters",
        });
      }
    }

    const result =
      await updateProfile(
        req.user.id,
        name,
        email,
        currentPassword,
        newPassword
      );

    res.status(200).json({
      status: "success",
      message:
        "Profile updated successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    if (
      error.message ===
      "Email already registered"
    ) {
      return res.status(409).json({
        status: "error",
        message:
          "Email already registered",
      });
    }

    if (
      error.message ===
      "Current password is incorrect"
    ) {
      return res.status(401).json({
        status: "error",
        message:
          "Current password is incorrect",
      });
    }

    if (
      error.message ===
      "Current password is required to change your password"
    ) {
      return res.status(400).json({
        status: "error",
        message:
          error.message,
      });
    }

    if (
      error.message ===
      "New password must be at least 8 characters"
    ) {
      return res.status(400).json({
        status: "error",
        message:
          error.message,
      });
    }

    if (
      error.message ===
      "User not found"
    ) {
      return res.status(404).json({
        status: "error",
        message:
          error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message:
        "Something went wrong",
    });
  }
}

module.exports = {
  signup,
  login,
  getMe,
  updateProfileController,
};