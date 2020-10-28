module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue ({ file }) {
        // // 路径名称因为示例项目里面包含了vant,所以加/lib来区分vant包路径
        return file.indexOf('vant/lib') !== -1 ? 37.5 : 16
      },
      propList: ['*'],
    },
  },
};