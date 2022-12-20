import { DB_HOST, DB_PORT, DB_DATABASE, DB_URL } from '@config';

export const dbConnection = {
  url: DB_URL || `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    directConnection: true,
  },
};
