<template>
  <div>
    <div class="header" id="head">
      <div class="title">
        <p>检测系统</p>
      </div>
    </div>

    <div class="form" style="position:relative">
      <div class="form_register" style="position:absolute">
        <form action="#" @submit.prevent>
          <h1>注册</h1>
          <div class="form_item">
            <label for="user_name">用户名：</label>
            <input
              v-model="username"
              type="text"
              name="user_name"
              id="user_name"
              placeholder="请输入用户名"
              required
            >
          </div>
          <div class="form_item">
            <label for="user_pwd">密码：</label>
            <input
              v-model="password"
              type="password"
              name="user_pwd"
              id="user_pwd"
              placeholder="请输入密码"
              required
            >
          </div>
          <!-- <div class="form_item">
					<label for="password2">确认密码：</label> <input v-model="password2" type="password"
				 placeholder="请确认密码" required>
          </div>-->
          <div class="form_item">
            <label for="user_email">电子邮箱：</label>
            <input
              v-model="email"
              type="text"
              name="user_email"
              id="user_email"
              placeholder="请输入正确格式的电子邮件 XXX@XXX"
              required
            >
          </div>
          <div class="form_item">
            <label for="tel">电话：</label>
            <input
              v-model="phone"
              type="user_tel"
              name="user_tel"
              id="user_tel"
              placeholder="请输入手机号码"
            >
          </div>
          <div class="form_item">
            <input type="submit" @click="onRegister" value="注册">
          </div>
        </form>
        <div class="info">
          已有账号？点击
          <span class="switch login_Btn">
            <router-link to="/login">登录</router-link>
          </span>
        </div>
      </div>
    </div>

    <div class="footer" id="foot">
      <div class="copyright">
        <p>Copyright © 2019 Qunar.com Inc. All Rights Reserved.</p>
        <ul>
          <li>&#xe62b;联系邮箱：2388078141@qq.com</li>
          <li>&#xe60d;联系地址：烟台大学</li>
          <li>&#xe60f;联系电话：17853533728</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      password: "",
      email: "",
      phone: ""
    };
  },
  methods: {
    async onRegister() {
      const data = {
        name: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone
      };
      console.log(data);
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/users/register", // 像后端 发送 POST 请求
        data // post 携带数据
      }).catch(err => {
        if (err.response.status == 500) {
          alert("邮箱已经存在");
        } else if (err.response.status == 400) {
          if (err.response.data.email) alert(err.response.data.email);
          else if (err.response.data.name) alert(err.response.data.name);
          else alert(err.response.data.password);
        }
      });
      if (
        data.name &&
        data.password &&
        data.email &&
        data.phone &&
        response.status == 200
      ) {
        alert("注册成功");
        this.$router.replace("/login");
        localStorage.setItem("login", false);
      } else {
        // 没填完
        alert("请完善信息");
      }
    }
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
#head {
  height: 80px;
}

.title {
  font-family: "楷体";
  font-size: 40px;
  text-align: center;
  color: #ffffff;
  position: absolute;
  height: 80px;
  width: 300px;
  margin-top: -20px;
  position: absolute;
  left: 450px;
}

.form {
  width: 500px;
  height: 700px;
  margin: 30px auto;
  left: 350px;
}

.form_register,
.form_login {
  width: 500px;
  background-color: rgba(0, 188, 212, 0.3);
  border-radius: 5px;
  box-shadow: 0 0 3px #ccc;
  overflow: hidden;
  transition: height 1s;
}

.form_register {
  height: 600px;
}

.form form {
  padding: 25px 40px;
}

.form .form_item {
  display: flex;
  margin: 25px 0;
  vertical-align: middle;
}

.form input {
  outline: none;
  text-indent: 10px;
  flex: 1;
  width: auto;
  border: none;
  border-radius: 3px;
  height: 36px;
}

.form form label {
  width: 90px;
  float: left;
  line-height: 36px;
}

h1 {
  text-align: center;
  padding: 0;
  margin: 30px 0 30px 0;
}

.form form input[type="submit"] {
  background-color: rgba(244, 22, 7, 0.7);
  color: aliceblue;
  height: 45px;
  font-size: 20px;
  cursor: pointer;
  margin-top: 20px;
}

.form .info {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}

.form .info span {
  color: crimson;
  margin-left: 3px;
}

.form .info span:hover {
  cursor: pointer;
  border-bottom: 1px solid crimson;
}

#foot {
  height: 100px;
}

/* .iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}

@font-face {
	font-family: 'iconfont';
	src: url('fontstyle/iconfont.eot');
	src: url('fontstyle/iconfont.eot?#iefix') format('embedded-opentype'),
		url('fontstyle/iconfont.woff2') format('woff2'),
		url('fontstyle/iconfont.woff') format('woff'),
		url('fontstyle/iconfont.ttf') format('truetype'),
		url('WebRoot/fontstyle/iconfont.svg#iconfont') format('svg');
} */

.copyright {
  font-family: "楷体";
  color: #000000;
  position: absolute;

  left: 590px;
  transform: translate(-50%, -50%); /* 使用css3的transform来实现 */
  text-align: center;
}

.copyright ul {
  list-style: none;
}

#foot .copyright p {
  height: 24px;
  width: 100%;
}
</style>
