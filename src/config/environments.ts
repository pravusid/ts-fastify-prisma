import * as dotenv from 'dotenv';

dotenv.config();

export const envs = {
  port: parseInt(process.env.PORT as string),
  nodeEnv: process.env.NODE_ENV as string,
  isProd: process.env.NODE_ENV === 'production',
};
