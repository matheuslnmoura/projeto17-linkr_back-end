import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let chachedDB = null;
let connectionParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function connectDB() {
  if (chachedDB) {
    return chachedDB;
  }

  if (process.env.DATABASE_URL) {
    connectionParams = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  const { Pool } = pg;

  const db = new Pool(connectionParams);

  await db.connect();

  chachedDB = db;

  return db;
}
const connection = await connectDB();

export default connection;
