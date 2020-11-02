<template>
  <div>
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
                <van-button type="primary" size="mini" @click="handleCheck(item, 2)">置顶</van-button>
                <van-button type="success" size="mini" @click="handleCheck(item, 1)">通过</van-button>
                <van-button type="danger" size="mini" @click="handleCheck(item, -1)">拒绝</van-button>
              </div>
            </div>

          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { ImagePreview } from 'vant'
import { Dialog } from 'vant'
import { getCommentList, setCommentState } from '@/api/topic'
export default {
  name: 'TopicCheck',
  components: {
  },
  data() {
    return {
      commentList: [],
      finishedComment: false,
      loadingComment: false,
      lastCommentId: 0
    }
  },
  methods: {
    async onCommentLoad() {
      this.loadingComment = true
      const resp = await getCommentList({ 'last_comment_id': this.lastCommentId, 'is_uncheck': true })
      this.loadingComment = false
      if (resp.d.rows.length === 0) {
        this.finishedComment = true
        return
      }
      console.log(resp.d.rows)
      this.commentList = [...this.commentList, ...resp.d.rows]
      this.lastCommentId = resp.d.last_comment_id
    },
    async handleCheck(item, state) {
      const stateText = {
        '-1': '删除',
        '1': '通过',
        '2': '置顶'
      }
      Dialog.confirm({
        title: '提示',
        message: `确认${stateText[String(state)]}该评论？`
      })
        .then(async() => {
          // on confirm
          await setCommentState({ 'comment_id': item.id, 'state': state })
          Toast.success('成功')
          const index = this.commentList.findIndex(obj => obj.id === item.id)
          this.commentList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    imgPreview(images, startPosition) {
      ImagePreview({
        images: images,
        startPosition: startPosition
      })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
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
      padding-left: 3px;
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
</style>
