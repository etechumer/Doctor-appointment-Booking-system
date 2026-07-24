import getPool, { sql } from "../db/db.js";

export const updateDoctorInfoController = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res
        .status(401)
        .json({ message: "Only doctors can update their profile" });
    }

    const doctorId = req.user.id;
    const { name, email, specialization, experience, qualification, phoneNo } =
      req.body;

    const pool = await getPool();

    const [checkDoctor] = await pool.execute(
      `SELECT * FROM doctors WHERE doctorId = ?`,
      [doctorId],
    );

    if (checkDoctor.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await pool.execute(
      `
        UPDATE doctors
        SET name = ?,
        email=?,
        specialization=?,
        experience=?,
        qualification=?,
        phoneNo=?

        WHERE doctorId = ?;
        `,
      [
        name,
        email,
        specialization,
        experience,
        qualification,
        phoneNo,
        doctorId,
      ],
    );

    const [updateDoctor] = await pool.execute(
      "SELECT * FROM doctors WHERE doctorId=?",
      [doctorId],
    );

    return res.status(200).json({
      message: "Doctor info updated successfully",
      doctor: updateDoctor[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getDoctorInfoController = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res
        .status(401)
        .json({ message: "Only doctors can view their profile" });
    }

    const doctorId = req.user.id;

    const pool = await getPool();

    const [result] = await pool.execute(
      `SELECT id, name, email, phoneNo, specialization, experience, qualification, doctorId,createdAt FROM doctors WHERE doctorId = ?`,
      [doctorId],
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({
      message: "Doctor info fetched successfully",
      doctor: result[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPendingAppointmentscontroller = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(401).json({ message: "Only doctors can access this" });
    }
    const doctorId = req.user.id;

    const pool = await getPool();

    const [result] = await pool.execute(
      `
            SELECT
            a.id,
            a.appointmentId,
            a.date,
            a.time,
            a.status,
            a.notes,
            a.patientId,
            a.doctorId,
            a.createdAt,

            -- Patient Info
            p.userId AS p_userId,
            p.name AS p_name,
            p.email AS p_email,
            p.phoneNo AS p_phoneNo,
            p.gender AS p_gender,
            p.age AS p_age,

            -- Doctor Info
            d.doctorId AS d_doctorId,
            d.name AS d_name,
            d.email AS d_email,
            d.phoneNo AS d_phoneNo,
            d.specialization AS d_specialization,
            d.experience AS d_experience,
            d.qualification AS d_qualification

            FROM appointments a
            INNER JOIN users p ON a.patientId = p.userId
            INNER JOIN doctors d ON a.doctorId = d.doctorId
            WHERE a.doctorId = ? AND status = 'PENDING'
            ORDER BY a.createdAt DESC
            `,
      [doctorId],
    );

    const formattedAppointments = result.map((row) => ({
      id: row.id,
      appointmentId: row.appointmentId,
      date: row.date,
      time: row.time,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,

      patient: {
        userId: row.p_userId,
        name: row.p_name,
        email: row.p_email,
        phoneNo: row.p_phoneNo,
        gender: row.p_gender,
        age: row.p_age,
      },
      doctor: {
        userId: row.d_doctorId,
        name: row.d_name,
        email: row.d_email,
        phoneNo: row.d_phoneNo,
        specialization: row.d_specialization,
        experience: row.d_experience,
        qualification: row.d_qualification,
      },
    }));

    return res.status(200).json({
      message: "Pending Appointments fetched successfully",
      appointments: formattedAppointments,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const approveAppointmentController = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res
        .status(401)
        .json({ message: "Only doctors can approve appointments" });
    }

    const { id } = req.params;
    const { date, time, notes } = req.body;

    const pool = await getPool();

    await pool.execute(
      `
            UPDATE appointments
            SET status = ?, date = ?, time = ?, notes = ? WHERE appointmentId = ?;

      `,
      ["BOOKED", date, time, notes || null, id],
    );
    const [result] = await pool.execute(
      "SELECT * FROM appointments WHERE appointmentId = ?; ",
      [id],
    );

    return res.status(200).json({
      message: "Appointment booked successfully",
      appointment: result[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const rejectAppointmentController = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res
        .status(401)
        .json({ message: "Only doctors can approve appointments" });
    }

    const { id } = req.params;

    const pool = await getPool();

    const result = await pool
      .request()
      .input("appointmentId", sql.VarChar, id)
      .input("status", sql.VarChar, "REJECTED").query(`
      UPDATE appointments
      SET status = @status WHERE appointmentId = @appointmentId;

      SELECT * FROM appointments WHERE appointmentId = @appointmentId;
      `);

    return res.status(200).json({
      message: "Appointment rejected successfully",
      appointment: result.recordset[0],
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRejectedAppointmentscontroller = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(401).json({
        message: "Only doctors can access this",
      });
    }

    const pool = await getPool();

    const [result] = await pool.execute(
      `
      SELECT
        a.id,
        a.appointmentId,
        a.date,
        a.time,
        a.status,
        a.notes,
        a.patientId,
        a.doctorId,
        a.createdAt,

        -- Patient Info
        p.userId AS p_userId,
        p.name AS p_name,
        p.email AS p_email,
        p.phoneNo AS p_phoneNo,
        p.gender AS p_gender,
        p.age AS p_age,

        -- Doctor Info
        d.doctorId AS d_doctorId,
        d.name AS d_name,
        d.email AS d_email,
        d.phoneNo AS d_phoneNo,
        d.specialization AS d_specialization,
        d.experience AS d_experience,
        d.qualification AS d_qualification

      FROM appointments a
      INNER JOIN users p ON a.patientId = p.userId
      INNER JOIN doctors d ON a.doctorId = d.doctorId
      WHERE a.doctorId = ? AND a.status = 'REJECTED'
      ORDER BY a.createdAt DESC
      `,
      [req.user.id],
    );

    const formattedAppointments = result.map((row) => ({
      id: row.id,
      appointmentId: row.appointmentId,
      date: row.date,
      time: row.time,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,

      patient: {
        userId: row.p_userId,
        name: row.p_name,
        email: row.p_email,
        phoneNo: row.p_phoneNo,
        gender: row.p_gender,
        age: row.p_age,
      },

      doctor: {
        doctorId: row.d_doctorId,
        name: row.d_name,
        email: row.d_email,
        phoneNo: row.d_phoneNo,
        specialization: row.d_specialization,
        experience: row.d_experience,
        qualification: row.d_qualification,
      },
    }));

    return res.status(200).json({
      message: "Rejected Appointments fetched successfully",
      appointments: formattedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getBookedAppointmentscontroller = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(401).json({
        message: "Only doctors can access this",
      });
    }

    const pool = await getPool();

    const [result] = await pool.execute(
      `
      SELECT
        a.id,
        a.appointmentId,
        a.date,
        a.time,
        a.status,
        a.notes,
        a.patientId,
        a.doctorId,
        a.createdAt,

        -- Patient Info
        p.userId AS p_userId,
        p.name AS p_name,
        p.email AS p_email,
        p.phoneNo AS p_phoneNo,
        p.gender AS p_gender,
        p.age AS p_age,

        -- Doctor Info
        d.doctorId AS d_doctorId,
        d.name AS d_name,
        d.email AS d_email,
        d.phoneNo AS d_phoneNo,
        d.specialization AS d_specialization,
        d.experience AS d_experience,
        d.qualification AS d_qualification

      FROM appointments a
      INNER JOIN users p ON a.patientId = p.userId
      INNER JOIN doctors d ON a.doctorId = d.doctorId
      WHERE a.doctorId = ? AND a.status = 'BOOKED'
      ORDER BY a.createdAt DESC
      `,
      [req.user.id],
    );

    const formattedAppointments = result.map((row) => ({
      id: row.id,
      appointmentId: row.appointmentId,
      date: row.date,
      time: row.time,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,

      patient: {
        userId: row.p_userId,
        name: row.p_name,
        email: row.p_email,
        phoneNo: row.p_phoneNo,
        gender: row.p_gender,
        age: row.p_age,
      },

      doctor: {
        doctorId: row.d_doctorId,
        name: row.d_name,
        email: row.d_email,
        phoneNo: row.d_phoneNo,
        specialization: row.d_specialization,
        experience: row.d_experience,
        qualification: row.d_qualification,
      },
    }));

    return res.status(200).json({
      message: "Booked Appointments fetched successfully",
      appointments: formattedAppointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllDoctorCountsController = async (req, res) => {
  if (req.user.role !== "DOCTOR") {
    return res.status(401).json({
      message: "Only doctors can access this",
    });
  }

  try {
    const pool = await getPool();

    const doctorId = req.user.id;

    const [[pending], [booked], [rejected]] = await Promise.all([
      pool.execute(
        "SELECT COUNT(*) AS count FROM appointments WHERE doctorId = ? AND status = 'PENDING'",
        [doctorId],
      ),
      pool.execute(
        "SELECT COUNT(*) AS count FROM appointments WHERE doctorId = ? AND status = 'BOOKED'",
        [doctorId],
      ),
      pool.execute(
        "SELECT COUNT(*) AS count FROM appointments WHERE doctorId = ? AND status = 'REJECTED'",
        [doctorId],
      ),
    ]);

    const totalAppointments =
      pending[0].count + booked[0].count + rejected[0].count;

    return res.status(200).json({
      message: "Dashboard counts fetched successfully",
      data: {
        pendingAppointments: pending[0].count,
        bookedAppointments: booked[0].count,
        rejectedAppointments: rejected[0].count,
        totalAppointments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Counts",
      error: error.message,
    });
  }
};
