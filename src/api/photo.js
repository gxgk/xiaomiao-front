import request from '@/utils/request'

export function uploadPhoto(data) {
  return request({
    url: '/upload/upload_img',
    method: 'post',
    data: data
  })
}
