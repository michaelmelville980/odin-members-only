const path = require("path");
const pool = require("./pool.js");

const SQL_users = `
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  first_name        VARCHAR(255) NOT NULL,
  last_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  is_member         BOOLEAN       NOT NULL DEFAULT FALSE,
  is_admin          BOOLEAN       NOT NULL DEFAULT FALSE
);
`;

const SQL_messages = `
CREATE TABLE IF NOT EXISTS messages (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER    NOT NULL
               REFERENCES users(id)
               ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  body         TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
`;

async function main() {
  console.log("seeding...");
  await pool.query(SQL_users);
  await pool.query(SQL_messages);
  await pool.end(); 
  console.log("done");
}

main();
