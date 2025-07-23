import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

async function getUsers() {
  try {
    return (await query("SELECT * from users"))?.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(id) {
  try {
    const res = await query("SELECT * from users where id=$1", [id]);
    if (res.rowCount !== 0) {
      return res.rows[0];
    }
  } catch (error) {
    console.log(error);
  }
}

async function getUserByEmail(email) {
  try {
    const result = await query("select * from users where email=$1", [email]);
    if (result.rowCount > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error(error);
  }
}

async function addUser(user) {
  const text = `INSERT INTO users(name,email,password,entries,joined_date)
                VALUES($1,$2,$3,$4,$5)`;
  const values = [
    user.name,
    user.email,
    user.password,
    user.entries,
    user.joinedDate,
  ];
  await query(text, values);
}

async function updateUserEntries(id, entries) {
  const text = `UPDATE users
    SET entries = $1
    WHERE id =$2`;
  const values = [entries, id];
  const result = await query(text, values);
}

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", {
    text,
    duration: `${duration}ms`,
    rows: result.rowCount,
  });
  return result;
}

export { getUsers, getUserById, getUserByEmail, addUser, updateUserEntries };
