import mysql from "mysql2/promise";

// Create a connection pool for better performance
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "figma_wafra_econ",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;