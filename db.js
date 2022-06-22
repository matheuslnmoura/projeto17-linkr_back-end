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

const connection = new Pool(connectionParams);

export default connection;
