import request from '@/utils/request'

export function getTopic(data) {
  return request({
    url: '/topic/index',
    method: 'get',
    params: data
  })
}

export function getCommentList(data) {
  return request({
    url: '/topic/comment',
    method: 'post',
    data: data
  })
}
