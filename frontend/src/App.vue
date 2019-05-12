<template>
  <div id="app">
    <div id="nav"></div>
    <router-view/>
  </div>
</template>

<style lang="less">
html,
body {
  margin: 0;
}
#app {
  height: 100vh;
  background-image: url("./assets/pic/2.jpg");
  // background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>
