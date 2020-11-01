import request from '@/utils/request'

export function getJsSdk(params) {
  return request({
    url: '/wechat_auth/oauth/jssdk',
    method: 'get',
    params: params
  })
}
