import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionParams = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === 'PROD') {
  connectionParams.ssl = {
    rejectUnauthorized: false,
  };
}

const { Pool } = pg;

const user = 'postgres';
const password = 'Otempoerei.';
const host = 'localhost';
const port = 5432;
const database = 'projeto17_backup';

const connection = new Pool({
  user,
  password,
  host,
  port,
  database,
});
export default connection;
