const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  publicPath: '',
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api': {
        target: 'http://127.0.0.1',
        // target: 'http://172.18.32.189:5004',
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  },
}