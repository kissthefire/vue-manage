/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
// 导入全局样式
import './assets/css/global.css'
//导入插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component("tree-table", TreeTable)

/****导入VueQuillEditor 富文本 */
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)
// 导入axios
import axios from 'axios'
axios.defaults.baseURL="http://192.168.1.160:8083/"
//axios.defaults.baseURL="http://192.168.43.237:8083/"
//配置请求拦截器
axios.interceptors.request.use(config=>{
 config.headers.token =window.sessionStorage.getItem('token');
 console.log(config);
 return config;
})
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)
  const y=dt.getFullYear
  const m=(dt.getMonth+1+'').padStart(2,'0')
  const d=(dt.getDate+'').padStart(2,'0')
  return `${y}-${m}-${d}`

})
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
