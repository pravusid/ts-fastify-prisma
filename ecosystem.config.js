/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'ts-fp',
      script: './dist/main.js',
      instances: 1,
      restart_delay: 1000,
      kill_timeout: 30000,
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        // https://www.prisma.io/docs/concepts/more/telemetry#when-is-data-collected
        CHECKPOINT_DISABLE: '1',
      },
    },
  ],
};
