import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  // 编写路由守护
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "register",
      component: () => import("./views/Register.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/product",
      name: "product",
      component: () => import("./views/Product.vue")
    }
  ]
});
// 路由守护
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.login ? true : false;
  if (to.path == "/" || to.path == "/login") {
    next(); // 登陆注册页面正常跳转
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router;
