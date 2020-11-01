
import { getJsSdk } from '@/api/wechat'
import wx from 'weixin-js-sdk'

export const JsSdkShareMixin = {
  data() {
    return {
      shareData: {
        title: document.title, // 分享标题
        desc: '', // 分享描述
        link: window.location.href,
        imgUrl: '' // 分享图标
      }
    }
  },
  created() {
    this.loadShareSdk()
  },
  methods: {
    // 排序
    async loadShareSdk() {
      const resp = await getJsSdk({ 'signature_url': window.location.href })
      wx.config(resp.d.jsapi)
      wx.ready(() => {
        wx.onMenuShareTimeline(this.shareData)
        wx.onMenuShareAppMessage(this.shareData)
        wx.onMenuShareQQ(this.shareData)
        wx.onMenuShareWeibo(this.shareData)
        wx.onMenuShareQZone(this.shareData)
      })
    }
  }
}
