const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

async function signupUser(name, email, password) {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  const user=result.rows[0];

   const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return {
    user,token
  }
}

async function loginUser(email, password) {
  const result = await pool.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const user = result.rows[0];

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!passwordMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

/* ---------------- Update Profile ---------------- */

async function updateProfile(
  userId,
  name,
  email,
  currentPassword,
  newPassword
) {
  /*
   * Get current user.
   */
  const userResult = await pool.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  /*
   * Normalize email.
   */
  const updatedEmail =
    email && email.trim()
      ? email.trim().toLowerCase()
      : user.email;

  /*
   * Check whether another account
   * already uses this email.
   */
  if (
    updatedEmail !== user.email
  ) {
    const existingEmail =
      await pool.query(
        `SELECT id
         FROM users
         WHERE email = $1
         AND id != $2`,
        [updatedEmail, userId]
      );

    if (
      existingEmail.rows.length > 0
    ) {
      throw new Error(
        "Email already registered"
      );
    }
  }

  /*
   * Validate password change.
   */
  if (newPassword) {
    if (!currentPassword) {
      throw new Error(
        "Current password is required to change your password"
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

    if (!passwordMatch) {
      throw new Error(
        "Current password is incorrect"
      );
    }

    if (newPassword.length < 8) {
      throw new Error(
        "New password must be at least 8 characters"
      );
    }
  }

  /*
   * Prepare updated name.
   */
  const updatedName =
    name && name.trim()
      ? name.trim()
      : user.name;

  /*
   * Keep existing password unless
   * a new password was requested.
   */
  let passwordHash =
    user.password_hash;

  if (newPassword) {
    passwordHash =
      await bcrypt.hash(
        newPassword,
        12
      );
  }

  /*
   * Update database.
   */
  const result = await pool.query(
    `UPDATE users
     SET
       name = $1,
       email = $2,
       password_hash = $3
     WHERE id = $4
     RETURNING id, name, email, created_at`,
    [
      updatedName,
      updatedEmail,
      passwordHash,
      userId,
    ]
  );

  const updatedUser =
    result.rows[0];

  /*
   * Generate fresh JWT.
   *
   * This is necessary because the
   * JWT contains the user's email.
   */
  const token = jwt.sign(
    {
      id: updatedUser.id,
      email: updatedUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: updatedUser,
    token,
  };
}

module.exports = {
  signupUser,
  loginUser,
  updateProfile,
};
