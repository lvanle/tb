<template>
  <div class="product">
    <nav class="blue">
      <div class="nav-wrapper container">
        <a href="#" class="brand-logo">京东评论分析</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            <span class="user">
              <img :src="userData.avatar" alt>
            </span>
          </li>
          <li>
            <span>{{userData.name}}</span>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="card downloader">
        <div class="card-content">
          <div class="link">
            <form @submit.prevent>
              <div class="input-field row">
                <input id="goods" type="text" v-model="link" class="col s10">
                <label for="goods">请输入所要查询的商品链接</label>
                <div class="btn s2 col waves-effect waves-light blue onsearch" @click="onDownload">
                  <i class="material-icons">cloud_download</i>
                  下载数据
                </div>
              </div>
            </form>
            <div class="downloadIndecator" v-if="indecator">
              预计时间：{{((2000*result.defData.maxPage)/60000).toFixed(2)}} 分钟
              <div class="progress">
                <div class="indeterminate"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="analysis card">
        <div class="card-content comments-content">
          <div class="row">
            <div class="col s4">
              <label for="startDay">选择起始日期：</label>
              <input id="startDay" type="text" v-model="startDate" placeholder="格式：2019-04-01">
            </div>
            <div class="col s4">
              <label for="endDay">选择结束日期：</label>
              <input id="endDay" type="text" v-model="endDate" placeholder="格式：2019-05-10">
            </div>
            <div class="col s3">
              <label for="someDay">选择其中的某一天：</label>
              <input id="someDay" type="text" v-model="someDate" placeholder="格式：2019-05-01">
            </div>
            <form @submit.prevent>
              <div class="btn blue col s1" @click="onSearch">查询</div>
            </form>
          </div>
          <div class="infos">
            <div class="simple-info">
              <span class="info-data">{{commentsData.length}}</span>
              <span class="info-title">总计评价人数</span>
            </div>
            <div class="simple-info">
              <span class="info-data">{{commentsData.rateCals}}%</span>
              <span class="info-title">{{someDate}}</span>
              <span class="info-title">占时间总体评价</span>
            </div>
            <div class="simple-info">
              <span class="info-data">{{isSuspect==true?"是":'否'}}</span>
              <span class="info-title">是否存在刷单嫌疑</span>
            </div>
            <div class="simple-info">
              <span class="info-data">
                {{commentsData.someDay}}
              </span>
              <span class="info-title">当天总体好评度</span>
            </div>
          </div>
          <div class="comments row">
            <div
              class="col s12 comments-data"
              v-for="item in commentsData.res"
              :key="item.rawData.id"
            >
              <div class="user">
                <div class="username left">{{item.rawData.nickname}}</div>
              </div>
              <div class="comments-content">
                {{item.rawData.comments}}
                <div class="rate-data">
                  <div class="posi">
                    褒义词:{{item.posiLength}}
                    <ul class="posi-content">
                      <li v-for="posi in item.positiveList" :key="posi">{{posi.word}}</li>
                    </ul>
                  </div>
                  <div class="nega">
                    贬义词:{{item.negaLength}}
                    <ul class="nega-content">
                      <li v-for="nega in item.negativeList" :key="nega">{{nega.word}}</li>
                    </ul>
                  </div>
                  <div class="rates">
                    评价
                    <span>{{((item.posiLength/(item.negaLength+item.posiLength))*100).toFixed(1)}}%</span>
                  </div>
                </div>
              </div>
              <div class="timepick right">{{item.rawData.referenceTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      token: this.$store.state.token,
      userData: "", // 后但返回 token 解析后数据
      link: "",
      result: "",
      indecator: false,
      startDate: "",
      endDate: "",
      commentsData: "",
      someDate: "",
      isSuspect: ""
    };
  },
  mounted() {
    M.AutoInit();
  },
  watch: {
    commentsData(arg) {
      let rateCals = arg.rateCals;
      if (rateCals >= 2) {
        this.isSuspect = true;
      } else {
        this.isSuspect = false;
      }
    }
  },
  methods: {
    onLogOut() {
      localStorage.clear();
      this.$router.replace("/login");
    },
    async onDownload() {
      this.indecator = true;
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/analysis/scrapy",
        data: {
          dogURL: this.link
        }
      }).catch(e => console.log(e));
      this.result = response.data;
      let maxPage = this.result.defData.maxPage;
      setTimeout(() => {
        this.indecator = false;
      }, maxPage * 1500);
    },
    async onSearch() {
      const response = await axios({
        method: "post",
        data: {
          startDate: this.startDate,
          endDate: this.endDate,
          someDate: this.someDate
        },
        url: "http://localhost:5000/api/analysis/analysis"
      }).catch(e => console.log(e));
      this.commentsData = response.data;
    }
  },
  async created() {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/api/users/current",
      headers: {
        Authorization: this.token
      }
    }).catch(e => console.log(e));
    this.userData = response.data; //响应数据存入data中
  }
};
</script>

<style lang='less' scoped>
@import url("../../node_modules/materialize-css/dist/css/materialize.min.css");

.product {
  min-height: 100vh;
  background-image: url("../assets/pic/2.jpg");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: 5rem;
  .user img {
    margin-top: 6px;
    margin-right: 20px;
    border-radius: 50%;
    width: 50px;
  }
  .onsearch {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .downloader {
    margin-top: 3rem;
  }
  .infos {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 2rem;
    .simple-info {
      text-align: center;
      display: inherit;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 180px;
      height: 180px;
      border-radius: 5px;
      border: 1px solid #ccc;
      .info-title {
        color: rgba(0, 0, 0, 0.5);
      }
      .info-data {
        color: #000;
        font-size: 30px;
      }
    }
  }
  .comments {
    max-height: 1000px;
    overflow-y: auto;
    .comments-data {
      border-top: 1px #ccc solid;
    }
    .timepick {
      color: rgba(0, 0, 0, 0.6);
    }
    .comments-content {
      transition: 300 ease-in-out;
      position: relative;
      padding: 0 10px 0 0;
      height: 200px;
      display: flex;
      align-items: center;
      cursor: pointer;
      overflow: hidden;
      &::before {
        content: '"';
        font-size: 35px;
        margin-top: -40px;
        padding: 0 5px 0 0;
      }
      &:hover > .rate-data {
        transition: 300;
        bottom: 0;
        top: 10px;
      }
    }
    .rate-data {
      border-radius: 10px;
      transition: 200 ease-in-out;
      position: absolute;
      bottom: 200px;
      left: 0;
      width: 100%;
      height: 190px;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-around;
      div {
        color: #fff;
      }
      .nega-content,
      .posi-content {
        display: flex;
        flex-direction: row;
        li {
          padding-right: 8px;
        }
      }
    }
  }
}
</style>
