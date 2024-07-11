module.exports = {
  apps : [{
    name: 'api-sails-legrand_develop',
    script: './app.js',
    watch: '.',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'DEVELOPMENT',
      PORT: 9002
    },
    instances: 1,
    autorestart: false
  }]

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
