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

export function deleteComment(data) {
  return request({
    url: '/topic/delete_comment',
    method: 'post',
    data: data
  })
}

export function likeComment(data) {
  return request({
    url: '/topic/like_comment',
    method: 'post',
    data: data
  })
}

export function topComment(data) {
  return request({
    url: '/topic/top_comment',
    method: 'post',
    data: data
  })
}

export function addComment(data) {
  return request({
    url: '/topic/add_comment',
    method: 'post',
    data: data
  })
}
