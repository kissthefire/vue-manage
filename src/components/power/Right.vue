<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
    <el-table :data="rightList" border>
      <el-table-column label type="index"></el-table-column>
      <el-table-column label="权限名称" prop="name"></el-table-column>
      <el-table-column label="路径" prop="url"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type=='0'">一级</el-tag>
          <el-tag  v-if="scope.row.type=='1'" type="warning">二级</el-tag>
          <el-tag  v-if="scope.row.type=='2'" type="success">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      //权限列表
      rightList: [],
      tagType: {
        "1": "success",
        "2": "error",
        "3": "info"
      }
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get("user/getRightList");
      if (res.meta.status != 200)
        return this.$message.error("获取权限列表失败");
      this.$message.success("获取权限列表成功");
      console.log(res.data);
      this.rightList = res.data;
    }
  }
};
</script>
<style lang="less" scoped>
</style>