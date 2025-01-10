/*
 * @Author: BigRocs
 * @Date: 2022-01-14 22:04:12
 * @LastEditTime: 2024-07-14 20:18:20
 * @LastEditors: BigRocs
 * @Description: QQ: 532388887, Email:bigrocs@qq.com
 */
import Vue from 'vue'
import store from './store'
import App from './App'
import uView from "uview-ui";

// 自动生成表单
import VueFormGenerator from 'vue-form-generator'
// import 'vue-form-generator/dist/vfg.css'

Vue.use(VueFormGenerator)

Vue.use(store);
Vue.use(uView);

import mIcon from "./components/m-cion";
Vue.component('m-icon', mIcon)

Vue.config.productionTip = false
App.mpType = 'app'

store.dispatch('setU', Vue.prototype.$u)
const app = new Vue({
  store,
  ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

// import routeIntercept from '@/common/route.interceptor.js';
// Vue.use(routeIntercept, app);

app.$mount()
