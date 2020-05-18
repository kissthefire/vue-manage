<template>
  <!--頁面主題佈局-->
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--侧边栏导航-->
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="collapseTransition"
          router
          unique-opened
        >
        <!--一级菜单-->
          <el-menu-item :index="item.menuId+''"  v-for="item in menuList"  v-bind:key="item.id" @click="saveNavState(item.url)">
            <!--一级菜单模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="item.icon"></i>
              <!--文本-->
              <span>{{item.name}}</span>
            </template>
            <!--<el-menu-item :index="'/'+subItem.url+''" v-for="subItem in item.children" v-bind:key="subItem.menuId" @click="saveNavState('/'+subItem.url)">
              <template slot="title">
                &lt;!&ndash;图标&ndash;&gt;
                <i class="el-icon-menu"></i>
                &lt;!&ndash;文本&ndash;&gt;
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>-->
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  data(){
      return {
        menuList:[{
          "id":1,
          "icon":"el-icon-location",
          "name":"员工薪资",
          "url":"/salary"
        },
        {
          "id":2,
          "icon":"el-icon-document",
          "name":"产品入库",
          "url":"/instorage"
        },
          {
            "id":3,
            "icon":"el-icon-document",
            "name":"产品出库",
            "url":"/outstorage"
          },
        {
          "id":4,
          "icon":"el-icon-menu",
          "name":"销售明细",
          "url":"/sales"
        },
        {
          "id":5,
          "icon":"el-icon-setting",
          "name":"毛利润分析",
          "url":"/salary"
        }],
        isCollapse:false,
        collapseTransition:false,
        activePath:''
      }
  },
  created(){
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods: {
    //登出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList(){
      const res=await this.$http.get('user/itemList');
      console.log(res)
      if(res.data.status!=200) return this.$message.error(res.data.meta.msg);
      //this.menuList=res.data.data;
    },
    //折叠
    toggleCollapse(){
     this.isCollapse=!this.isCollapse
    },
    //保存菜单状态
    saveNavState(activePath){
      console.log("-------------")
      console.log(activePath)
    window.sessionStorage.setItem('activePath',activePath)
    this.$router.push(activePath)
      //this.activePath=activePath
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  //清除左间距
  padding-left: 0;
  align-content: center;
  //字体颜色
  color: #fff;
  //字体大小
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none
  }
}
.el-main {
  background-color: #eaedf1;
}
img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #eee;
}
.toggle-button{
  background-color: #4a5064;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
