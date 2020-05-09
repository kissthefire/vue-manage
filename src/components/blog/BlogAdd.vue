<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">博客管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>创建博客</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-alert title="创建博客信息" type="info" center show-icon :closable="false"></el-alert>
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="摘要" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="主题内容" prop="content">
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
          <el-button type="primary" class="btnAdd" @click="add">发布</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      addForm: {
        content: "",
        title:''
      },
      addFormrules: {
           title: [
          { required: true, message: "请输入文章摘要", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20个字符", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    add() {
        this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "blog/insert",
          this.addForm
        );
        if (res.code != 200) {
          this.$message.error("创建博客失败");
        }
        this.$message.success("创建博客成功");
        this.$router.push("/blog");
    });
  }
  }
  }
</script>