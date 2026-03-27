module.exports = {
  apps: [
    {
      name: 'travelbuddy-backend',
      script: 'src/server.js',
      instances: 'max', // Use all available CPUs
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/error.log', // Will create a logs folder for pm2 logs
      out_file: 'logs/out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
