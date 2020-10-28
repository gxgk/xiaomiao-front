import axios from 'axios'
import { Toast } from 'vant'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 60 * 1000 // request timeout
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['AppId'] = 'wx8703c0de5603e9ac'
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
    if (Number(res.code) !== 200) {
      Toast.fail(res.msg)
      return Promise.reject(new Error(response.data.msg))
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
