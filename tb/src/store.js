import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:''
  },
  mutations: {
    addToken:(state,val)=>state.token = val
  },
  getters:{
    getToken:state=>state.token
  },
  actions: {
    async updateUser({commit},val){
      await commit('addToken',val)  //把数据提交（commit）给 mutation
    }
  }
});
