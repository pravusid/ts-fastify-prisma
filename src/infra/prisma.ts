import { PrismaClient } from '@prisma/client';
import { envs } from '../config/environments.js';

Object.assign(BigInt.prototype, {
  toJSON: function () {
    return String(this);
  },
});

export const prisma = new PrismaClient({
  log: envs.isProd ? ['error', 'warn'] : ['error', 'warn', 'info', 'query'],
});
