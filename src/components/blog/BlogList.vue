<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">博客管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable @clear="getBlogList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getBlogList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goaddBlogPage">创建博客</el-button>
        </el-col>
      </el-row>
      <el-table :data="blogList" border stripe>
        <el-table-column label type="index"></el-table-column>
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="内容" prop="content" v-html="content"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              @click="showBlog(scope.row)"
            >查看</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--展示文章详情-->
    <el-dialog
      title="查看文章"
      :visible.sync="viewBlogVisable"
      width="100%"
      left
      @close="viewBlogDiaLogClosed"
    >
      <div>
        <p>{{blog.title}}</p>
        <p v-html="blog.content">{{blog.content}}</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      //查询参数
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
      blogList: [],
      viewBlogVisable: false,
      blog: {}
    };
  },
  created() {
    this.getBlogList();
  },
  methods: {
    async getBlogList() {
      const { data: res } = await this.$http.get("blog/list");
      console.log(res);
      if (res.code != 200) return this.$message.error("获取文章列表失败");
      this.$message.success("获取文章列表成功");
      this.blogList = res.data;
    },
    goaddBlogPage() {
      this.$router.push("/blog/blogAdd");
    },
    removeById(row) {},
    showBlog(row) {
      this.blog = row;
      this.viewBlogVisable = true;
    },
    viewBlogDiaLogClosed(){

    }
  }
};
</script>
<style lang="less" scoped>
</style>
