import { Pool } from 'pg';

// This ensures that we only have one instance of the pool across the application.
declare global {
  // eslint-disable-next-line no-var
  var pool: Pool | undefined;
}

let db;

if (process.env.NODE_ENV === 'production') {
  db = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  if (!global.pool) {
    global.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  db = global.pool;
}

export default db;

