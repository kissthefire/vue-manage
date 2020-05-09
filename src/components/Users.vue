<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--展示数据table-->
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="userId" label="用户ID"></el-table-column> -->
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="roleNames" label="角色"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="userStatechanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.userId)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="设置角色" placement="top">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserByid(scope.row.userId)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
    <!--dialog添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      left
      @close="addDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialog"
      width="50%"
      left
      @close="setRoleDiaLogClosed"
    >
      <div>
        <p>用户名: {{userInfo.username}}</p>
        <p>角色: {{userInfo.roleNames}}</p>
        <p>
          分配新角色 ：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo(userInfo.userId,selectedRoleId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    //自定义校验邮箱规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmaail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmaail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkPhone = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的入参
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      //控制是否显示对话框
      addDialogVisible: false,
      //控制展示的修改用户的对话框
      editdialogVisible: false,
      //添加用户的表单
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        nickname:""
      },
      editForm: {},
      //规则
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 20个字符", trigger: "blur" }
        ],
         nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            trigger: "blur"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      addFormRef: {},
      //设置角色对话框
      setRoleDialog: false,
      total: 10,
      userInfo: {},
      //角色列表
      roleList: [],
      selectedRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("user/userList", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data;
      this.total = res.meta.count;
    },
    //监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
      console.log(newSize);
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pageNo = newPage;
      this.getUserList();
      console.log("当前页：" + newPage);
    },
    async userStatechanged(changed) {
      console.log(changed.status);
      //调用和后端接口
      const resourceurl = "user/updateUserStatus/" + changed.userId + "/status/" + changed.status;
      const { data: res } = await this.$http.get(resourceurl);
      if (res.meta.status != 200) {
        return this.$message.error("修改状态失败");
      }
      this.$message.success("修改状态成功");
      this.getUserList();
    },
    search() {
      this.getUserList();
    },
    //展示对话框
    showDialog() {
      this.addDialogVisible = true;
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击电梯昂对话框的确定按钮触发
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "user/saveUser",
          this.addForm
        );
        if (res.meta.status != 200) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    //展示修改用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("user/getUserById?id=" + id);
      if (res.meta.status != 200)
        return this.$message.error("查询用户信息失败");
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    //关闭修改用户修改对话监听事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "user/editUser",
          this.editForm
        );
        if (res.meta.status != 200) {
          this.$message.error("修改用户失败");
        }
        this.$message.success("修改用户成功");
        this.editdialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    //根据id删除用户
    async removeUserByid(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.get(
            "user/deleteUserById?id=" + id
          );
          if (res.meta.status == 100) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUserList();
          } else {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("user/getRolesList");
      if (res.meta.status != 200) {
        this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      this.setRoleDialog = true;
    },
    //保存分配角色的信息
    async saveRoleInfo(userId, roleId) {
      if (!roleId) {
        return this.$message.info("请选择要分配的角色");
      }
      const resourceurl = "user/saveRoleInfo/" + userId + "/roleId/" + roleId;
      const { data: res } = await this.$http.get(resourceurl);
      if (res.meta.status != 200) {
        return this.$message.error("分配角色失败");
      }
      this.$message.success("分配角色成功");
      this.setRoleDialog = false;
      this.getUserList();
    },
    //关闭分配角色对话框监听事件
    setRoleDiaLogClosed() {
      this.userInfo = {};
      this.selectedRoleId = "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>