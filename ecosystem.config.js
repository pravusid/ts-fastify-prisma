/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'ts-fp',
      script: './dist/main.js',
      instances: 2,
      restart_delay: 2000,
      kill_timeout: 5000,
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        CHECKPOINT_DISABLE: '1',
      },
    },
  ],
};
