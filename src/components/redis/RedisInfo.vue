<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">redis管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>redis信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--搜索-->
    <el-card class="box-card">{{redisInfo}}</el-card>
  </div>
</template>
<script>
/* eslint-disable */
export default {
     data() {
         return{
             redisInfo:''
         }
     },
     created(){
      this.getRedisInfo()
     },
     methods:{
       async getRedisInfo(){
            const { data: res } = await this.$http.get("redis/redisInfo");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.redisInfo = res.data;
       }
     }
}
</script>
<style scoped>
</style>