import axios from 'axios'
import { Toast } from 'vant'

const APP_ID = 'wx8703c0de5603e9ac'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 60 * 1000 // request timeout
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['AppId'] = APP_ID
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (Number(res.c) === 302) {
      const redirectUrl = encodeURIComponent(window.location.href)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.d.appid}` +
      `&redirect_uri=${redirectUrl}&response_type=code&scope=${res.d.scope}&component_appid=${res.d.component_appid}&connect_redirect=1`
      return Promise.reject(new Error(response.data.m))
    } else if (Number(res.c) !== 0) {
      Toast.fail(res.m)
      return Promise.reject(new Error(response.data.m))
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

export default service
