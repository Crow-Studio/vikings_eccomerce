module.exports = {
  apps: [
    {
      name: "vikingstraders",
      script: "pnpm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      env_file: ".env.production",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/log/pm2/vikingstraders-error.log",
      out_file: "/var/log/pm2/vikingstraders-out.log",
      log_file: "/var/log/pm2/vikingstraders.log",
      combine_logs: true,
      time: true,
      max_memory_restart: "1G",
    },
  ],
};
