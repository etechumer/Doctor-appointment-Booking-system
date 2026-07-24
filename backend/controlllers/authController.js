import getPool from "../db/db.js";
import { hashSync, compareSync } from "bcrypt";
import { sendEmail } from "../services/gmail.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generatePatientUserId = async (pool) => {
  const [result] = await pool.execute(
    `SELECT userId 
        FROM users 
        WHERE role = 'PATIENT' 
        AND userId LIKE 'PAT%' 
        ORDER BY id DESC 
        LIMIT 1
        `,
  );

  if (result.length === 0) {
    return "PAT001";
  }
  const lastId = result[0].userId;
  const numericPart = parseInt(lastId.slice(3));
  const newNumericPart = (numericPart + 1).toString().padStart(3, "0");
  return `PAT${newNumericPart}`;
};

export const RegisterPatientController = async (req, res) => {
  try {
    const { name, email, password, phoneNo, gender, age } = req.body;
    if (!name || !email || !password || !phoneNo || !gender || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (phoneNo.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    const pool = await getPool();

    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
        existingUser: existingUser[0],
      });
    }

    const userId = await generatePatientUserId(pool);
    const hashPassword = hashSync(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users(name, userId, email, password, phoneNo, gender, age)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            `,
      [name, userId, email, hashPassword, phoneNo, gender, age],
    );

    const [newUser] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);
    delete newUser[0].password; // Remove password from the response
    res.status(201).json({
      message: "Patient registered successfully",
      user: newUser[0],
    });

    setImmediate(() => {
      sendEmail({
        to: email,
        subject: "Your Patient account credentials",
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #2E86C1;">Welcome to Platform!</h2>
                    <p>Your account as a patient has been created successfully.</p>
                    <p>Here are your login credentials:</p>
                    <ul style="font-size: 18px; font-weight: bold; color: #D35400;">
                        <li>Patient ID: ${userId} </li>
                        <li>Password: ${password}</li>
                    </ul>
                    <p>Please <strong>change this password after logging in</strong> for security.</p>
                     <br />
                    <p style="font-size: 14px; color: #7F8C8D;">
                    If you did not expect this email, please contact the admin immediately.
                    </p>
                </div>            
                `,
      })
        .then(() => console.log("Email sent"))
        .catch((err) => console.log(err));
    });
    return;
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const loginController = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    userId === process.env.ADMIN_ID &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { id: process.env.ADMIN_ID, role: "Admin" },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Admin Login successful",
      token,
      user: { adminId: userId, role: "Admin" },
    });
  } else {
    try {
      const pool = await getPool();
      const [user] = await pool.execute(
        "SELECT * FROM users WHERE userId = ?",
        [userId],
      );

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const comparePassword = compareSync(password, user[0].password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      const token = jwt.sign({ id: userId, role: user[0].role }, JWT_SECRET, {
        expiresIn: "1d",
      });
      delete user[0].password; // Remove password from the response
      return res.status(200).json({
        message: "Login successful",
        token,
        user: user[0],
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  }
};

export const getUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    const [user] = await pool.execute(" SELECT * FROM users WHERE userId = ?", [
      userId,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userData = user[0];
    delete userData.password; // Remove password from the response
    return res.status(200).json({
      message: "User fetched successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phoneNo, gender, age } = req.body;
    if (!name || !email || !phoneNo || !gender || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await getPool();

    const checkUser = await pool.execute(
      "SELECT * FROM users where userId = ?",
      [userId],
    );
    if (checkUser[0].length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await pool.execute(
      `UPDATE users
            SET name = ?, email = ?, phoneNo = ?, gender = ?, age = ?
            WHERE userId = ?`,
      [name, email, phoneNo, gender, age, userId],
    );

    const [updatedUser] = await pool.execute(
      "SELECT * FROM users WHERE userId = ?",
      [userId],
    );
    delete updatedUser[0].password;

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New Password is required" });
    }
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "PATIENT" && role !== "DOCTOR") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const pool = await getPool();

    const [userResult] = await pool.execute(
      "SELECT email FROM users WHERE userId = ?",
      [userId],
    );
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const email = user.email;
    const hashPassword = hashSync(newPassword, 10);

    await pool.execute("UPDATE users SET password = ? WHERE userId = ?", [
      hashPassword,
      userId,
    ]);

    const [updatedResult] = await pool.execute(
      "SELECT userId,name,email,role,phoneNo,gender,age FROM users WHERE userId = ?",
      [userId],
    );
    res.status(200).json({
      message: "Password Updated Successfully",
      user: updatedResult[0],
    });

    setImmediate(() => {
      sendEmail({
        to: email,
        subject: `Your ${role} Account Credentials`,
        html: `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #2E86C1;">Account Updated Successfully</h2>
                <p>Your account as a ${role.toLowerCase()} has been updated.</p>
                <p>Here are your login credentials:</p>
                <ul style="font-size: 18px; font-weight: bold; color: #D35400;">
                    <li>User ID: ${userId}</li>
                    <li>New Password: ${newPassword}</li>
                </ul>
                <br />
                <p style="font-size: 14px; color: #7F8C8D;">
                If you did not expect this email, please contact the admin immediately.
                </p>
            </div>
            `,
      })
        .then(() => console.log("Email sent"))
        .catch((err) => console.log(err));
    });
    return;
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const { appointmentId, receiverId, message } = req.body;

    if (!appointmentId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await getPool();

    const [appointmentCheck] = await pool.execute(
      `SELECT status FROM appointments WHERE appointmentId = ?`,
      [appointmentId],
    );

    if (appointmentCheck.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const status = appointmentCheck[0].status;

    if (status !== "BOOKED") {
      return res
        .status(403)
        .json({
          message: "You can only send messages for booked appointments",
        });
    }

    await pool.execute(
      `
        INSERT INTO chats (appointmentId, senderId, receiverId, message)
        VALUES (?, ?, ?, ?)
        `,
      [appointmentId, req.user.id, receiverId, message],
    );

    const [result] = await pool.execute("SELECT * FROM chats WHERE id = ?", [
      result.insertId,
    ]);

    return res.status(201).json({
      message: "Message Sent Successfully",
      chat: result[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getChatHistoryController = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ message: "appointmentId is required" });
    }

    const pool = await getPool();

    const [result] = await pool.execute(
      `
            SELECT * FROM chats WHERE appointmentId = ? 
            ORDER BY createdAt ASC
            `,
      [appointmentId],
    );

    return res.status(201).json({
      message: "Chat history fetched Successfully",
      chat: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};
