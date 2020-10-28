<template>
  <div class="topic">
    <audio id="music" loop="loop" preload="auto" :src="mp3url" />
    <div class="top_img">
      <van-image width="100%" :src="picture_url" />
      <div class="top_artice">
        <div class="top_title">
          <div># {{ topic_name }}#</div>
          <p>{{ comment_num }}人参与</p>
        </div>
      </div>
    </div>
    <div class="topic_main">
      <div class="gxIcon">
        莞
      </div>
      <div class="summary">
        <p>
          {{ summary }}
        </p>

      </div>
    </div>
    <van-divider content-position="left">精选评论</van-divider>
    <!-- <div class="partingLine">精选评论</div> -->
    <div class="comments-main">
      <van-list
        v-model="bestList"
        :loading="loadingBest"
        :finished="finishedBest"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in bestList" :key="item">
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

              <div class="context">{{ item.context }}</div>
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
                <div class="time">{{ item.create_time }}</div>
                <div class="icon">
                  <vue-clap-button :size="20" :init-clicked="0" />
                  <van-icon class="iconfont" class-prefix="icon" name="delete" :size="21" color="#909399" />
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
        v-model="bestList"
        :loading="loadingBest"
        :finished="finishedBest"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in bestList" :key="item">
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

              <div class="context">{{ item.context }}</div>
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
                <div class="time">{{ item.create_time }}</div>
                <div class="icon">
                  <vue-clap-button :size="20" :init-clicked="0" />
                  <van-icon class="iconfont" class-prefix="icon" name="delete" :size="21" color="#909399" />
                </div>
              </div>

            </div>
          </div>
        </van-cell>
      </van-list>
    </div>

    <img class="musicBtn" src="@/assets/img/music.png">
    <van-button type="primary" class="join-button" @click="joinComment()">立即参与</van-button>
    <van-popup v-model:show="showComment" position="bottom" closeable class="comment-popup" teleport="body">
      <div style="padding: 10px 0;">发表评论</div>
      <van-field
        v-model="message"
        rows="4"
        autosize
        safe-area-inset-bottom
        label=""
        type="textarea"
        maxlength="200"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-field label="图片上传">
        <template #input>
          <van-uploader :after-read="afterRead" />
        </template>
      </van-field>
      <van-button type="primary" class="submit-button" @click="joinComment()">提交</van-button>
    </van-popup>
  </div>

</template>

<script>
export default {
  name: 'Topic',
  components: {

  },
  data() {
    return {
      topic_name: '冬天来了',
      comment_num: 100,
      summary: '冬天要来了，大多数的人都随着气温的降低，情绪也变得有点丧。\n临近期末，对于大四的学生而言，是忙碌的。忙着做好大学最后一次期末考试复习准备，忙着写论文，制作简历寻找实习，忙着为考研或出国而努力。在被一堆事情压着的日子里，总有人不免变得丧气。\n想要大家分享一些令人愉悦的事情或者能让人重获能量的建议。毕竟，美好的生活要自己好好经营，希望大家都保持期待未来，人间值得的态度喔❤️',
      picture_url: 'https://photo.gxgkcat.com/xiaomiao/img/2019/11/25/BeQRvkx6VYj9iVuPueOulRnKeITDZY.jpeg',
      mp3url: '',
      loadingBest: false,
      finishedBest: false,
      bestList: [{ 'nickname': 'NULL', 'head_img_url': 'http://thirdwx.qlogo.cn/mmopen/CJu3LWk6jKFBMmXZrf5rA3d8DI7to3vJTKU8m4KUdlLibusu6q3y7gS5gGhaVTfEVYmuLhoXuGeCibEq8DZhFj0g/132', context: '假期走起，甩掉丧丧。甩掉肥肉。让一切厄运随风消散，让沉入低谷的心重见光明。@小喵', create_time: '2020-01-01' },
        { 'nickname': 'NULL', 'head_img_url': 'http://thirdwx.qlogo.cn/mmopen/CJu3LWk6jKFBMmXZrf5rA3d8DI7to3vJTKU8m4KUdlLibusu6q3y7gS5gGhaVTfEVYmuLhoXuGeCibEq8DZhFj0g/132', context: '假期走起，甩掉丧丧。甩掉肥肉。让一切厄运随风消散，让沉入低谷的心重见光明。@小喵', create_time: '2020-01-01', 'img_urls': ['https://photo.gxgkcat.com/xiaomiao/img/2020/10/20/U9DnLO0K4adt36alJBTztgQ1lQ7c77.png?imageView2/0/h/140'] }],
      showComment: false,
      message: ''
    }
  },
  methods: {
    joinComment() {
      this.showComment = true
    }
  }
}
</script>
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
  width: 50%;
  background-color: rgb(255, 255, 255, 0.4);
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

    .icon {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 50px;

      .iconfont {
        vertical-align: baseline;
        transform: translateY(calc(50% - 0.5em))
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
    padding: 5px 0;
  }
}

</style>
<style>
.comment-popup {
  height: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
