<template>
  <div class="product">
    <div id="main" class="container">
      <div id="user_info" class="card horizontal">
        <div class="card-image">
          <img :src="userData.avatar" alt>
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <h4>{{userData.name}} 欢迎你</h4>
            <h5>邮箱：{{userData.email}}</h5>
            <h5>电话：{{userData.phone}}</h5>
          </div>
          <div class="card-action">
            <input
              type=" submit"
              @click="onLogOut"
              class="btn blue waves-effect waves-light"
              value="退出登录"
            >
          </div>
        </div>
      </div>
      <div id="test" class="card">
        <div class="card-content">
          <!-- <div class="tip">
            <h3>请提交所要查询的商品的全部链接！非全部链接不能保证检测的准确性。。。。。。</h3>
          </div>-->
          <div class="link">
            <form @submit.prevent>
              <div class="input-field row">
                <input id="goods" type="text" v-model="link" class="col s10">
                <label for="goods">请输入所要查询的商品链接</label>
                <div class="btn s2 col waves-effect waves-light blue" @click="onSearch">查询</div>
              </div>
            </form>
          </div>
          <div v-if="result">
            <div class="judge">
              <div class="title">显示查询出来的评价</div>
              <div class="comments" v-for="(comment,index) in result.result.comments" :key="index">
                <div class="comment">{{comment}}</div>
                <div class="divider"></div>
              </div>
            </div>
            <div class="analyse row">
              <div class="title">显示褒贬词个数：</div>
              <div class="col s6">
                <div class="positive">
                  <p style="font-size:20px;margin-bottom:5px;">褒义词</p>
                  <div class="divider"></div>
                  <ul v-for="(p_word,index) in result.result.positiveRes" :key="index">
                    <li>{{p_word.word}} {{p_word.weight}}</li>
                  </ul>
                </div>
              </div>
              <div class="col s6">
                <div class="negative">
                  <p style="font-size:20px;margin-bottom:5px;">贬义词</p>
                  <div class="divider"></div>
                  <ul v-for="(n_word,index) in result.result.negativeRes" :key="index">
                    <li>{{n_word.word}} {{n_word.weight}}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="result">
              <!-- <p>显示最终结果</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../../node_modules/materialize-css/dist/css/materialize.css";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      token: this.$store.state.token,
      userData: "", // 后但返回 token 解析后数据
      link: "",
      result: ""
    };
  },
  mounted() {
    M.AutoInit();
  },
  methods: {
    onLogOut() {
      localStorage.clear();
      this.$router.replace("/login");
    },
    async onSearch() {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/analysis/analysis",
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        data: {
          dogURL: this.link
        }
      }).catch(e => console.log(e));
      this.result = response.data; // 后端向前端返回ajax数据
      console.log(response);
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
html {
  height: 100%;
}

.product {
  background-image: url("../assets/pic/2.jpg");
  // background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
#main {
  padding: 3rem 0;
}
#user_info img {
  width: 80%;
}
.comment {
  margin-bottom: 20px;
  &::before {
    content: "“";
    font-size: 35px;
    line-height: 1;
    color: #ccc;
    margin-right: 10px;
  }
}
.title {
  font-size: 30px;
  position: relative;
  color: #000;
  margin: 20px 0;
}
.positive,
.negative {
  text-align: center;
}
</style>
