import getPool, { sql } from "../db/db.js";
export const getAllDoctorsController = async (req, res) => {
  try {
    const pool = await getPool();

    const [doctors] = await pool.execute(
      `SELECT doctorId, name, specialization, qualification, email, phoneNo
       FROM doctors LIMIT 3`,
    );

    if (doctors.length === 0) {
      return res.status(404).json({
        message: "No Doctors Found",
      });
    }

    return res.status(200).json({
      message: "Doctors Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error Fetching doctors", error);

    return res.status(500).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
};
