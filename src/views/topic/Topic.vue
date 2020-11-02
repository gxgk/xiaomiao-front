<template>
  <div class="topic">
    <audio id="audio" loop="loop" preload="auto" autoplay="autoplay" :src="topicInfo.mp3url" />
    <div class="top_img">
      <van-image width="100%" :src="topicInfo.picture_url" />
      <div class="top_artice">
        <div class="top_title">
          <div># {{ topicInfo.title }} #</div>
          <p style="margin: 4px 0">{{ commentNum }}人参与</p>
        </div>
      </div>
    </div>
    <div class="topic_main">
      <div class="gxIcon">
        莞
      </div>
      <div class="summary">
        <p>
          {{ topicInfo.summary }}
        </p>

      </div>
    </div>
    <van-divider content-position="left">精选评论</van-divider>
    <!-- <div class="partingLine">精选评论</div> -->
    <div class="comments-main">
      <van-list
        v-model="bestCommentList"
        :loading="loadingBest"
        :finished="finishedBest"
        finished-text=""
        @load="onBestCommentLoad"
      >
        <van-cell v-for="item in bestCommentList" :key="item.id">
          <div class="comment-box">
            <van-image
              width="4rem"
              height="4rem"
              radius="10"
              round
              fit="contain"
              :src="item.head_img_url"
            />
            <div class="right">
              <div class="nickname">{{ item.nickname }}</div>

              <div class="context">{{ item.comment }}</div>
              <div v-if="item.img_urls">
                <van-image
                  v-for="url in item.img_urls"
                  :key="url"
                  fit="contain"
                  width="100"
                  height="100"
                  :src="url"
                />
              </div>
              <div class="bottom-bar">
                <div class="time">{{ item.time_str }}</div>
                <div class="icon">
                  <vue-clap-button :size="20" :init-clicked="item.is_like" @click="handleLikeComment(item, false)" />
                  <van-icon v-if="isAdmin" class="iconfont" class-prefix="icon" name="download" :size="16" color="#909399" @click="handleTopComment(bestCommentList, item, false)" />
                  <van-icon v-if="isAdmin || item.is_author" class="iconfont" class-prefix="icon" name="delete" :size="16" color="#909399" @click="handleDeleteComment(bestCommentList, item)" />
                </div>
              </div>

            </div>
          </div>
        </van-cell>
      </van-list>

    </div>
    <!-- <div class="partingLine">最新评论</div> -->
    <van-divider content-position="left">最新评论</van-divider>
    <div class="comments-main" style="padding-bottom: 80px">
      <van-list
        v-model="commentList"
        :loading="loadingComment"
        :finished="finishedComment"
        finished-text="没有更多了"
        @load="onCommentLoad"
      >
        <van-cell v-for="item in commentList" :key="item.id">
          <div class="comment-box">
            <van-image
              width="4rem"
              height="4rem"
              radius="10"
              round
              fit="contain"
              :src="item.head_img_url"
            />
            <div class="right">
              <div class="nickname">{{ item.nickname }}</div>

              <div class="context">{{ item.comment }}</div>
              <div v-if="item.img_urls">
                <van-image
                  v-for="(url, index) in item.img_urls"
                  :key="url"
                  fit="contain"
                  width="100"
                  height="100"
                  :src="url"
                  @click="imgPreview(item.img_urls, index)"
                />
              </div>
              <div class="bottom-bar">
                <div class="time">{{ item.time_str }}</div>
                <div class="icon">
                  <vue-clap-button :size="20" :init-clicked="item.is_like" @click="handleLikeComment(item, true)" />
                  <van-icon v-if="isAdmin" class="iconfont" class-prefix="icon" name="upload" :size="16" color="#909399" @click="handleTopComment(commentList, item, true)" />
                  <van-icon v-if="isAdmin || item.is_author" class="iconfont" class-prefix="icon" name="delete" :size="16" color="#909399" @click="handleDeleteComment(commentList, item)" />
                </div>
              </div>

            </div>
          </div>
        </van-cell>
      </van-list>
    </div>

    <img id="musicBtn" class="musicBtn musicSpin" :class="{ 'musicSpinPause': !isMusicActive }" src="@/assets/img/music.png" @click="musicClick">
    <van-button type="primary" class="join-button" @click="joinComment()">立即参与</van-button>
    <van-popup v-model:show="showComment" position="bottom" closeable class="comment-popup" teleport="body">
      <div style="padding: 15px 0;">发表评论</div>
      <van-form class="submit-form" @submit="submitComment" @failed="onFailed">
        <van-field
          v-model="message"
          rows="4"
          autosize
          safe-area-inset-bottom
          label=""
          type="textarea"
          maxlength="200"
          placeholder="请输入评论"
          show-word-limit
          :rules="[{ required: true, message: '请填写评论' }]"
        />
        <van-field label="图片上传">
          <template #input>
            <van-uploader ref="upload" v-model="fileList" :after-read="afterRead" :max-count="3" multiple deletable />
          </template>
        </van-field>
        <van-button type="primary" round class="submit-button" native-type="submit">提交</van-button>
      </van-form>
    </van-popup>
  </div>

</template>

<script>
import { List, Toast } from 'vant'
import { ImagePreview } from 'vant'
import { Dialog } from 'vant'
import { JsSdkShareMixin } from '@/mixins/CommonMixin'
import { getCommentList, getTopic, deleteComment, likeComment, setCommentState, addComment } from '@/api/topic'
import { uploadPhoto } from '@/api/photo'
export default {
  name: 'Topic',
  components: {
  },
  mixins: [JsSdkShareMixin],
  data() {
    return {
      topicInfo: {},
      commentNum: 100,
      loadingBest: false,
      finishedBest: false,
      lastBestCommentId: 0,
      bestCommentList: [],
      commentList: [],
      showComment: false,
      message: '',
      topicId: 0,
      isAdmin: false,
      fileList: [],
      finishedComment: false,
      loadingComment: false,
      lastCommentId: 0,
      isMusicActive: true,
      shareData: {
        title: document.title, // 分享标题
        desc: '', // 分享描述
        link: window.location.href,
        imgUrl: '' // 分享图标
      }
    }
  },
  created() {
    // this.playMusic()
  },
  mounted() {
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener(
          'WeixinJSBridgeReady',
          this.playMusic,
          false
        )
      } else if (document.attachEvent) {
        document.attachEvent(
          'WeixinJSBridgeReady',
          this.playMusic
        )
        document.attachEvent(
          'onWeixinJSBridgeReady',
          this.playMusic
        )
      }
    } else {
      this.playMusic()
    }
  },
  methods: {
    playMusic() {
      var audio = document.getElementById('audio')
      window.WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
        audio.play()
      })
    },
    async getTopic() {
      const resp = await getTopic({ 'topic_id': this.topicId })
      console.log(resp)
      this.topicInfo = resp.d.topic_info
      this.commentNum = resp.d.topic_comment_num
      this.isAdmin = resp.d.is_admin
      this.topicId = resp.d.topic_info.id

      this.shareData = {
        title: this.topicInfo.title, // 分享标题
        desc: this.topicInfo.summary, // 分享描述
        link: window.location.href,
        imgUrl: this.topicInfo.picture_url // 分享图标
      }
    },
    async onBestCommentLoad() {
      this.loadingBest = true
      if (!this.topicId) {
        await this.getTopic()
      }
      const resp = await getCommentList({ 'topic_id': this.topicId, 'last_comment_id': this.lastBestCommentId, 'is_best': true })
      this.loadingBest = false
      if (resp.d.rows.length === 0) {
        this.finishedBest = true
        return
      }
      this.bestCommentList = [...this.bestCommentList, ...resp.d.rows]
      this.lastBestCommentId = resp.d.last_comment_id
    },
    async onCommentLoad() {
      this.loadingComment = true
      if (!this.topicId) {
        await this.getTopic()
      }
      const resp = await getCommentList({ 'topic_id': this.topicId, 'last_comment_id': this.lastCommentId })
      this.loadingComment = false
      if (resp.d.rows.length === 0) {
        this.finishedComment = true
        return
      }
      console.log(resp.d.rows)
      this.commentList = [...this.commentList, ...resp.d.rows]
      this.lastCommentId = resp.d.last_comment_id
    },
    async fetchComment() {
      this.bestCommentList = []
      this.lastBestCommentId = 0
      this.onBestCommentLoad()
      this.lastCommentId = 0
      this.commentList = []
      this.onCommentLoad()
    },
    joinComment() {
      this.showComment = true
    },
    async submitComment() {
      const photoIds = []
      for (const i in this.fileList) {
        photoIds.push(this.fileList[i].photoId)
      }
      console.log(photoIds)
      try {
        await addComment({ 'topic_id': this.topicId, 'comment': this.message, photo_ids: photoIds })
        this.message = ''
        this.fileList = []
        Toast.success('提交成功，等待管理员审核')
        this.showComment = false
        this.fetchComment()
      } catch (error) {
        console.log(error)
        this.showComment = true
      }
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
      this.showComment = true
    },
    async handleLikeComment(row) {
      await likeComment({ 'topic_id': this.topicId, 'comment_id': row.id })
    },
    handleTopComment(commentList, item, top) {
      Dialog.confirm({
        title: '提示',
        message: top ? '确认置顶该评论？' : '确认取消置顶该评论？'
      })
        .then(async() => {
          // on confirm
          await setCommentState({ 'comment_id': item.id, 'state': top ? '2' : '1' })
          Toast.success(top ? '置顶成功' : '取消置顶成功')
          const index = commentList.findIndex(obj => obj.id === item.id)
          commentList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    handleDeleteComment(commentList, item) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除该评论？'
      })
        .then(async() => {
          // on confirm
          await deleteComment({ 'topic_id': this.topicId, 'comment_id': item.id })
          Toast.success('删除成功')
          const index = commentList.findIndex(obj => obj.id === item.id)
          commentList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    async afterRead(fileList, detail) {
      // Vant or Vue Bug
      // file.status = 'uploading'
      // file.message = '上传中...'
      if (typeof fileList !== List) {
        fileList = [fileList]
      }

      for (const file of fileList) {
        console.log(file)
        // file.status = 'uploading'
        // file.message = '上传中...'

        const formdata = new FormData()
        formdata.append('photo_files', file.file)
        try {
          const resp = await uploadPhoto(formdata)
          console.log(resp)
          file.status = 'done'
          file.message = '上传成功'
          file.photoId = resp.d.photo_ids[0]
          file.url = resp.d.photo_list[0].img_url
        } catch (error) {
          console.log(error)
          file.status = 'failed'
          file.message = '上传失败'
        }
        console.log(file)
      }
    },
    imgPreview(images, startPosition) {
      ImagePreview({
        images: images,
        startPosition: startPosition
      })
    },
    musicClick() {
      this.isMusicActive = !this.isMusicActive

      var audio = document.getElementById('audio')
      if (!this.isMusicActive) {
        audio.pause()
      } else {
        audio.play()
      }
    }
  }
}
</script>
<style>
.vclapbtn-bin-wrap svg {
  width: 16px;
  height: 16px;
}
</style>
<style scoped lang="scss" rel="stylesheet/scss">
.top_img img{
	width: 100%;
	height: 500px;
}
.top_artice{
	position: absolute;
  display: flex;
  justify-content: center;
	width: 100%;
	top: 10%;
  font-size: 30px;
	font-family: "微软雅黑";
	text-align: center;
  font-weight: bold;
  color: rgb(48, 48, 48);
  /* text-shadow: 2px 3px 2px #000; */
}
.top_title {
  // width: 50%;
  background-color: rgb(255, 255, 255, 0.4);
  padding: 10px 10px;
}
.top_artice p{
  font-size: 10px;
}
.gxIcon{
	position: absolute;
	left: 3%;
	background-color: #079df2;
	color: #fff;
	font-size: 18px;
	font-family: "微软雅黑";
	padding: 10px 10px;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}
.topic_main{
	width: 100%;
	margin-top: -7px;
}
.summary{
  display: flex;
	width: 70%;
  padding: 10px;
	margin: 0 auto;
  justify-content: center;
  flex-direction: column;
	font-family: "微软雅黑";
  background-color: #fff;
}
.summary p {
  text-align: left;
  font-size: 15px;
  font-family: "微软雅黑";
  font-weight: bold;
  line-height: 24px;
  color: #3e3e3e;
  white-space: pre-wrap;
}
.join-button {
	position: fixed;
	background-color: #52a8ff;
	border: none;
	padding: 10px 0;
	border-radius: 5px;
	color: #fff;
	box-shadow: 0 13px 10px -8px #52a8ff;
	bottom: 25px;
	outline: none;
  width: 300px;
  margin:0 auto;
  left:0;
  right:0;
}
.submit-button {
	background-color: #52a8ff;
	border: none;
	padding: 10px 0;
  margin: 10px 0;
	border-radius: 5px;
	color: #fff;
	box-shadow: 0 13px 10px -8px #52a8ff;
  width: 300px;
}
.musicBtn {
  position: fixed;
  right: 30px;
  top: 30px;
}

.musicSpin {
    animation: musicSpin 2.2s linear infinite;
    -webkit-animation: musicSpin 2.2s linear infinite
}

.musicSpinPause {
  animation-play-state: paused;
}

@keyframes musicSpin {
    0% {
        transform: rotate(0deg)
    }
    100% {
        transform: rotate(360deg)
    }
}

@-webkit-keyframes musicSpin {
    0% {
        -webkit-transform: rotate(0deg)
    }
    100% {
        -webkit-transform: rotate(360deg)
    }
}

.comments-main {

}
.comment-box {
  display: flex;
  flex-direction: row;
  .right {
    width: 100%;
    padding: 0 20px;
  }
  .bottom-bar {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    font-size: 8pt;

    .icon {
      display: flex;
      flex-direction: row;
      justify-content: right;
      align-items: center;
      padding-left: 6px;
      // width: 80px;

      .iconfont {
        vertical-align: baseline;
        transform: translateY(calc(50% - 0.7em))
      }
    }
  }
  .nickname {
    color: #007aaa;
    font-size: 14px;
    font-weight: bold;
    font-family: SimHei;
  }
  .context {
    padding-top: 5px;
    padding-bottom: 10px;
  }
}
.submit-form {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  display: flex;
}
</style>
<style>
.comment-popup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
