

module.exports = {
  apps: [
    // local
    {
      name: "i18n-service-local",
      script: "./app.js",
      watch: true,
      env: {
        "NODE_ENV": "development",
        "SITE_PROD_ENV": "local"
      },
      error_file: "./log/pm2.log",
      out_file: "./log/pm2.log",
      combine_logs: true,
    },

    // prod
    {
      name: "i18n-service-prod",
      script: "./app.js",
      watch: false,
      env: {
        "NODE_ENV": "production",
        "SITE_PROD_ENV": "prod"
      },
      error_file: "./log/pm2.log",
      out_file: "./log/pm2.log",
      combine_logs: true,
    },
  ]
}
