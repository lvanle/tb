<template>
  <div class="Product">
    <div id="main">
      <div id="user_info">
        <div class="pic">
          <img :src="userData.avatar" alt>
        </div>
        <div class="welcome">
          <p>{{userData.name}} 欢迎你</p>
          <p>邮箱：{{userData.email}}</p>
          <p>电话：{{userData.phone}}</p>
        </div>
        <input type="submit" @click="onLogOut" value="退出登录">
      </div>
      <div id="test">
        <div class="tip">
          <h3>请提交所要查询的商品的全部链接！非全部链接不能保证检测的准确性。。。。。。</h3>
        </div>
        <div class="link">
          <label for="goods">请输入所要查询的商品链接</label>
          <input type="text" id="goods" name="goods" v-model="link" placeholder="链接">
          <input type="submit" @click="onSearch" value="查询">
        </div>
        <div class="judge">
          <p>显示查询出来的评价</p>
          <div class="comments" v-for="i in result" :key="i.id">
            <!-- 在这里加类 然后写样式 -->
            <div class="comment">{{i.content}}</div>
          </div>
        </div>
        <div class="analyse">
          <p>显示褒贬词个数</p>
          <div class="positive">
            <p>褒义词</p>
          </div>
          <div class="negative">
            <p>贬义词</p>
          </div>
        </div>
        <div class="result">
          <p>显示最终结果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
export default {
  /**
   * {
   * id: '5ccf9904f936ea1278661d0a',
   * name: 'xz',
   * avatar:'//www.gravatar.com/avatar/c1f68a6526e1264c58113503d597344b?s=400&r=pg&d=mm',
   * phone: 111111,
   * iat: 1557126071,
   * exp: 1557129671
   * }
   */
  data() {
    return {
      token: this.$store.state.token,
      userData: "", // 后但返回 token 解析后数据
      link: "",
      result: [
        {
          id: 1,
          content:
            "看了很久 比较了许多产品才选的这款手机 给老爸用 很喜欢 音质特别好 像素也高  外观特别漂亮 拿在手里手感不错 家里小米的东西很多 一直支持小米 性能很好的一款手机  总之特别满意  以后再选手机 就是小米了 家里人用的也是小米 速度特别快 没有什么问题 很愉快的一次购物 快递也是很快 满意"
        },
        {
          id: 2,
          content:
            "首先，很高兴很激动抢购成功！京东的服务与速度让我无可挑剔！说回产品本身，这次的红米note7，让我眼前一亮，综合实力在同价位无敌，甚至在更高价格机型中也是出类拔萃！拿到手的颜值非常高，渐变蓝颜色很酷，手感握着舒适，屏幕修长，显示效果不错，大家吐槽的下巴我看着还可以，能接受！重点说一下外放声音非常大，有种混响低音炮的感觉，尤其是听dj歌曲。听筒音量也很大，涉及通话内容，建议调低音量，不然周围人都能听清！熟悉的miui系统，爱不释手！非常好用的小爱同学，好像出了BUG，升级系统后，不能语音唤醒了，有点可惜！后置拍摄可圈可点，但是前置拍摄不是很给力，有带算法更新，女孩子可能很介意！特地跟我的小米8比了一下，青出于蓝胜于蓝。双面玻璃机身，质感很好，摄像头是有点突出，还能接受。总之，这次的红米note7综合实力很强，性价比高，颜值不错，功能强大，老少通吃！祝愿小米红米越来越好，永远相信，美好的事情即将发生！！！"
        },
        {
          id: 3,
          content:
            "性价比非常高这次买的是暮光金的，喜欢小米的字体和屏幕，感觉操作起来也挺不错。屏幕很大但女生的手拿着并没有什么不适，握感挺好的，挺符合人机工学。屏幕很大像素照人有点点美颜感。千元机良心！颜色好看，手机很流畅，刚刚开始还不太习惯这个操作，现在已经很流畅了，很好！超级好看！分辨率很高！，电池使用一天半，相机不错，系统也非常的流畅。确实性价比很高。红色的变黑色的要好看不少。千元机里面私人觉得红米Note7最值得购买，续航强劲，拍照比以前有提升，做工也没有很 Low的感觉，质量真的很好！手机不错,性能强大,外型不错,性价比很好,全面屏，看视频上网页都很流畅。比起小米8的夜景模式还是相差有点远～购买这个手机满足日常还是可以的～从颜色到款式都喜欢！期待能用久些！"
        },
        {
          id: 4,
          content:
            "很不错是手机，活动预约抢购的，辛辛苦苦调研一两天，醋坛子不小心打翻了，撒一地有些伤心，不过手机很不错，非常灵光，Type-C快速充电、指纹识别、人脸识别很适合老人用，比指纹灵光，性价比不错的千元机，给老丈人和老妈同时各买一部，以便~视频联络，聊解寂寞。"
        }
      ]
    };
  },
  methods: {
    onLogOut() {
      localStorage.clear();
      this.$router.replace("/login");
    },
    async onSearch() {
      const data = await axios({
        method: "post",
        url:'localhost:5000/api/analysis/analysis',
        data: {
          dogURL: this.link
        }
      });
      this.result = data
    }
  },
  async created() {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/api/users/current",
      headers: {
        Authorization: this.token
      }
    });
    this.userData = response.data; //响应数据存入data中
  }
};
</script>

<style>
html {
  height: 100%;
}

body {
  background: url("../assets/pic/2.jpg") no-repeat;
}
#main {
  width: 1000px;
  height: 1000px;
  position: center;
  margin-left: 130px;
  background-color: rgba(0, 212, 184, 0.37);
  text-align: left;
}
#user_info {
  background-color: white;
}
img {
  width: 150px;
  height: 150px;
  margin-left: 40px;
  margin-top: 20px;
  margin-bottom: -10px;
}
.welcome {
  margin-left: 400px;
  margin-top: -150px;
  position: right;
}
#user_info input {
  outline: none;
  text-indent: 10px;
  flex: 1;
  border-style: ridge;
  height: 30px;
  width: 100px;
  margin-left: 800px;
  margin-bottom: 15px;
}
#test {
  height: 950px;
  margin-top: 20px;
  background-color: white;
  overflow: auto;
}
.tip {
  height: 40px;
  background-color: white;
}
.link {
  height: 100px;
  background-color: white;
}
.link label {
  width: 200px;
  float: left;
  line-height: 93px;
}
.link input {
  outline: none;
  text-indent: 10px;
  flex: 1;
  width: auto;
  border-color: black;
  border-radius: 3px;
  height: 36px;
  width: 350px;
}
.link input[type="submit"] {
  background-color: rgba(175, 242, 247, 0.7);
  color: teal;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  margin-top: 25px;
}
.judge {
  height: 400px;
  background-color: white;
  overflow: auto;
  border-style: ridge;
}
.analyse {
  height: 400px;
  background-color: white;
  overflow: auto;
  border-style: ridge;
}
.positive {
  height: 250px;
  width: 250px;
  margin-left: 150px;
  margin-top: 20px;
  border-style: ridge;
}
.negative {
  height: 250px;
  width: 250px;
  position: relative;
  margin-top: -255px;
  margin-left: 550px;
  border-style: ridge;
}
.result {
  height: 300px;
  background-color: white;
  overflow: auto;
  border-style: ridge;
}
.comments {
  padding: 10px;
  margin: 20px 0;
  border: 1px #ccc solid;
  margin-left: 30px;
}
</style>
