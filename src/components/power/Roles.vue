<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getRoleList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column label type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              v-for="(item,i1) in scope.row.children"
              :key="item.id"
            >
              <!--一级权限使用-->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightById(scope.row,item.menuId)"
                >{{item.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级权限-->
              <el-col :span="19">
                <el-row
                  :class="['bdbottom',i2===0?'bdtop':'','vcenter']"
                  v-for="(subitem,i2) in item.children"
                  :key="subitem.menuId"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,subitem.menuId)"
                    >{{subitem.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--三级权限-->
                    <el-row
                      :class="['bdbottom',i3===0?'bdtop':'','vcenter']"
                      v-for="(item3,i3) in subitem.children"
                      :key="i3"
                    >
                      <el-col :span="24">
                        <el-tag
                          type="warning"
                          closable
                          @close="removeRightById(scope.row,item3.menuId)"
                        >{{item3.name}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> {{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column label type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.roleId)"
            >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限的对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialog" width="50%" @close="resetRight" left>
      <!--树形控件-->
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="menuId"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defKeys"
        :props="treeProps"
        check-on-click-node
        ref="treeRef"
        check-strictly
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <!--dialog添加用户的对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      left
      @close="addDialogClosed"
    >
      <!--添加的对话框-->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改角色的对话框-->
    <el-dialog title="修改角色" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      roleList: [],
      //设置权限
      setRightDialog: false,
      //权限数据
      rightList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "name",
        children: "children"
      },
      //设置角色对话框
      setRoleDialog: false,
      defKeys: [],
      defRole:{},
      /*** 搜索框*/
      queryInfo: { query: "" },
      //添加用户的表单
      addForm: {
        roleName: "",
        remark: ""
      },
      addFormrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 20个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "长度在 3 到 100 个字符",
            trigger: "blur"
          }
        ]
      },
      addFormRef: {},
      addDialogVisible: false,
      editForm: {},
      editFormRef: {},
      editdialogVisible: false
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get("user/getRolesList");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      this.$message.success("获取角色列表成功");
    },
    async removeRightById(role, id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该权限么, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const resourceurl = "user/delteRight/" + role.roleId + "/rightId/" + id;
      const { data: res } = await this.$http.delete(resourceurl);
      //执行真正的删除 为角色信息重新赋值
      role.children = res.data;
    },
    //展示设置权限的对话框
    async showSetRightDialog(role) {
      //this.rightList=role.children
      const { data: res } = await this.$http.get("user/getMenuList");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success("获取权限列表成功");
      this.rightList = res.data;
      //console.log( res.data)
      this.getleafDefaultKey(role, this.defKeys);
      // this.defKeys.forEach((item) => {
	    // this.$refs.treeRef.setChecked(item, true, false)//单个节点循环赋值
      //   })
      console.log("defKeys="+this.defKeys)
      this.defRole=role;
      this.setRightDialog = true;
    },
    resetRight() {
      this.defRole=[];
      this.defKeys=[]
    },
    //分配权限
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const keyStr = keys.join(",");
      console.log(keyStr);
      //调用后台接口
       const resourceurl = "user/saveRoleMenuInfo?roleId="+this.defRole.roleId+"&menuIds="+keyStr;
      const { data: res } = await this.$http.get(resourceurl);
      if (res.meta.status != 200) {
        return this.$message.error("分配菜单失败");
      }
      this.$message.success("分配菜单成功");
      this.setRightDialog = false;
      this.getRoleList();
    },
    //获取默认勾选的key
    getleafDefaultKey(node, arr) {
      if (node.children) {
         arr.push(node.menuId);
      }
      node.children.forEach(item => {
        this.getleafDefaultKey(item, arr);
      });
    },
    //展示添加的对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    //关闭添加的对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      //this.addDialogVisible = false;
    },
    //添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "user/saveRole",
          this.addForm
        );
        if (res.meta.status != 200) {
          this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.addDialogVisible = false;
        //刷新列表
        this.getRoleList();
      });
    },
    //编辑角色
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //校验通过，可以发起请求
        const { data: res } = await this.$http.post(
          "user/editRole",
          this.editForm
        );
        if (res.meta.status != 200) {
          this.$message.error("修改角色信息失败");
        }
        this.$message.success("修改角色信息成功");
        this.editdialogVisible = false;
        //刷新列表
        this.getUserList();
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        "user/getRoleById?roleId=" + id
      );
      if (res.meta.status != 200)
        return this.$message.error("查询角色信息失败");
      this.editForm = res.data;
      this.editdialogVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>