module.exports = {
  apps: [
    {
      name: '@hawk-tracker/server',
      script: './dist/index.js',
      watch: ['./dist'],
      ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
    },
  ],
};
