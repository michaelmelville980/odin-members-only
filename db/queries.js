const pool = require("./pool");

async function isDuplicateEmail(email) {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );
  return rowCount > 0;
}

async function findUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    username,
  ]);
  return rows[0];
}

async function findUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return rows[0];
}

async function createUser(req, hashedPassword) {
  await pool.query(
    "insert into users (first_name, last_name, email, password_hash, is_member, is_admin) values ($1, $2, $3, $4, $5, $6)",
    [
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      hashedPassword,
      false,
      req.body.isAdmin === "true",
    ]
  );
}

async function giveMembershipStatus(id) {
  await pool.query(
    `
      UPDATE users
      SET is_member = TRUE
      WHERE id = $1
      RETURNING *;
      `,
    [id]
  );
}

module.exports = {
  isDuplicateEmail,
  findUserByUsername,
  findUserById,
  createUser,
  giveMembershipStatus
};
