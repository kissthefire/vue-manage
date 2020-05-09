<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">菜单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--搜索-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getMenuList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">添加菜单</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--展示数据table-->
    <!--表格-->
    <tree-table
      :data="menuList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      class="treetable"
    >
      <template slot="isok" slot-scope="scope">
        <i v-if="scope.row.status==1" style="color:lightgreen" class="el-icon-success"></i>
        <i v-if="scope.row.status==2" style="color:red" class="el-icon-error"></i>
      </template>
      <!--排序-->
      <template slot="level" slot-scope="scope">
        <el-tag v-if="scope.row.type===1">一级</el-tag>
        <el-tag v-if="scope.row.type===2" type="warning">二级</el-tag>
        <el-tag v-if="scope.row.type===3" type="success">三级</el-tag>
      </template>
      <!--操作-->
      <template slot="operate" slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="showMenu(scope.row.menuId)"
          size="mini"
        >编辑</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button> -->
      </template>
    </tree-table>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加菜单"
      :visible.sync="addMenusDialogVisible"
      width="30%"
      @closed="addDialogClosed"
    >
      <el-form
        ref="addMunusformRef"
        :model="addMunusform"
        label-width="100px"
        :rules="addMenusformRules"
      >
        <el-form-item label="菜单名称:" prop="name">
          <el-input v-model="addMunusform.name"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="addMunusform.url"></el-input>
        </el-form-item>
        <el-form-item label="菜单ICON" prop="url">
          <el-input v-model="addMunusform.icon"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单:" prop="name">
          <el-cascader
            expand-trigger="hovor"
            v-model="selectedKeys"
            :options="parentList"
            :props="cascaderProps"
            @change="parentMenuchanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMenusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑菜单-->
    <el-dialog title="修改菜单" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单url" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "name"
        },
        {
          label: "菜单url",
          prop: "url"
        },
        {
          label: "是否有效",
          prop: "status",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          prop: "type",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      addMenusDialogVisible: false,
      addMunusform: {
        name: "",
        url: "",
        type: 1,
        parentId: 0,
        icon:''
      },
      //添加菜单的规则
      addMenusformRules: {
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur"
          }
        ]
      },
      //级联菜单返回的父List
      parentList: [],
      //配置级联选择器的props
      cascaderProps: {
        value: "menuId",
        label: "name",
        children: "children"
      },
      //选中的父级分类的id数组
      selectedKeys: [],
      editdialogVisible: false,
      editForm: {},
      editFormrules: {}
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("user/getMenuList");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    async showDialog() {
      const { data: res } = await this.$http.get("user/getMenuList");
      if (res.meta.status != 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.parentList = res.data;
      this.addMenusDialogVisible = true;
    },
    saveMenu() {
      //执行预校验
      this.$refs.addMunusformRef.validate(async valid => {
        if (!valid) return;
        //发起请求
        const { data: res } = await this.$http.post(
          "user/saveMunu",
          this.addMunusform
        );
        if (res.meta.status != 200) return this.$message.error("保存菜单失败");
        this.$message.success("保存菜单成功");
        this.getMenuList();
        this.addMenusDialogVisible = false;
      });
    },
    parentMenuchanged() {
      console.log(this.selectedKeys);
      //如果selectedKeys 的长度等于0时，无父节点。为第一级
      //大于0选中了父级分类需要为addCateGoryform 重新赋值
      if (this.selectedKeys.length > 0) {
        this.addMunusform.parentId = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addMunusform.type = this.selectedKeys.length + 1;
        return;
      } else {
        this.addMunusform.parentId = 0;
        this.addMunusform.type = 1;
      }
    },
    addDialogClosed() {
      this.$refs.addMunusformRef.resetFields();
      this.selectedKeys = [];
      this.addMunusform.type = 1;
      this.addMunusform.parentId = 0;
    },
    async showMenu(id) {
      const { data: res } = await this.$http.get("user/getUMenusById?id=" + id);
      if (res.meta.status != 200)
        return this.$message.error("查询菜单信息失败");
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    editDialogClosed() {},
    editMenu() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "user/editMenu",
          this.editForm
        );
        if (res.meta.status != 200) {
          this.$message.error("修改菜单失败");
        }
        this.$message.success("修改菜单成功");
        this.editdialogVisible = false;
        //刷新列表
        this.getMenuList();
      });
    }
  }
};
</script>
<style scoped>
</style>
