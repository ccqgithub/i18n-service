

module.exports = {
  apps: [
    // local
    {
      name: "local",
      script: "./app.js",
      watch: true,
      env: {
        "NODE_ENV": "development",
        "NODE_SITE_ENV": "local"
      },
      error_file: "./log/pm2.log",
      out_file: "./log/pm2.log",
    },

    // test

  ]
}
